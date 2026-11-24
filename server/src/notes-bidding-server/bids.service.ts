// FEATURE 1: selling notes by bidding.
import {
  BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NoteRequest } from './entities/note-request.entity';
import { NoteRequestVote } from './entities/note-request-vote.entity';
import { Bid } from './entities/bid.entity';
import { BidStatus, RequestStatus } from './entities/enums';
import { PlaceBidDto, UpdateBidDto } from './dto/place-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(NoteRequest) private readonly requests: Repository<NoteRequest>,
    @InjectRepository(NoteRequestVote) private readonly votes: Repository<NoteRequestVote>,
    @InjectRepository(Bid) private readonly bids: Repository<Bid>,
    private readonly dataSource: DataSource,
  ) {}

  /** Step 3: a note writer submits an offer. */
  async placeBid(writerId: number, requestId: number, dto: PlaceBidDto) {
    const request = await this.getRequestOrFail(requestId);
    this.assertAcceptingBids(request);

    // a requester can't bid on their own demand
    const isRequester = await this.votes.count({ where: { request: { id: requestId }, studentId: writerId } });
    if (isRequester > 0) throw new ForbiddenException('Requesters cannot bid on their own request');

    const existing = await this.bids.findOne({ where: { request: { id: requestId }, writerId } });
    if (existing) throw new ConflictException('You already placed a bid. Edit it instead.');

    return this.bids.save(this.bids.create({ ...dto, writerId, request }));
  }

  /** "Edit Bid": only your own pending bid, only while bidding is open. */
  async updateBid(writerId: number, requestId: number, bidId: number, dto: UpdateBidDto) {
    const request = await this.getRequestOrFail(requestId);
    this.assertAcceptingBids(request);

    const bid = await this.getBidOrFail(requestId, bidId);
    if (bid.writerId !== writerId) throw new ForbiddenException('This is not your bid');
    if (bid.status !== BidStatus.PENDING) throw new BadRequestException('This bid can no longer be edited');

    Object.assign(bid, dto);
    return this.bids.save(bid);
  }

  /** "Withdraw Bid" */
  async withdrawBid(writerId: number, requestId: number, bidId: number) {
    const request = await this.getRequestOrFail(requestId);
    this.assertAcceptingBids(request);

    const bid = await this.getBidOrFail(requestId, bidId);
    if (bid.writerId !== writerId) throw new ForbiddenException('This is not your bid');
    if (bid.status !== BidStatus.PENDING) throw new BadRequestException('This bid cannot be withdrawn');

    bid.status = BidStatus.WITHDRAWN;
    return this.bids.save(bid);
  }

  /** Bids are visible once bidding has opened. Writers' names/ids are included for the requester. */
  async listBids(requestId: number) {
    const request = await this.getRequestOrFail(requestId);
    if (request.status === RequestStatus.COLLECTING) {
      throw new BadRequestException('Bidding has not opened yet');
    }
    return this.bids.find({ where: { request: { id: requestId } }, order: { price: 'ASC' } });
  }

  /** Step 4: the requester accepts one bid; all other pending bids are rejected. */
  async acceptBid(userId: number, requestId: number, bidId: number) {
    return this.dataSource.transaction(async (m) => {
      const request = await m.findOne(NoteRequest, {
        where: { id: requestId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!request) throw new NotFoundException('Request not found');
      if (request.createdById !== userId) throw new ForbiddenException('Only the requester can accept a bid');
      // The requester may accept after the deadline too (the deadline only stops NEW bids).
      if (request.status !== RequestStatus.BIDDING_OPEN) {
        throw new BadRequestException('A bid can only be accepted while bidding is open');
      }

      const allBids = await m.find(Bid, { where: { request: { id: requestId } } });
      const chosen = allBids.find((b) => b.id === bidId);
      if (!chosen) throw new NotFoundException('Bid not found');
      if (chosen.status !== BidStatus.PENDING) throw new BadRequestException('This bid is not available');

      for (const b of allBids) {
        if (b.status === BidStatus.WITHDRAWN) continue;
        b.status = b.id === bidId ? BidStatus.ACCEPTED : BidStatus.REJECTED;
      }
      await m.save(allBids);

      request.status = RequestStatus.BID_ACCEPTED;
      request.acceptedBidId = bidId;
      await m.save(request);
      // TODO (wallet teammate): hold the agreed credits in escrow here

      return { requestId, acceptedBidId: bidId, status: request.status };
    });
  }

  /** "Reject" a single bid without choosing a winner yet. */
  async rejectBid(userId: number, requestId: number, bidId: number) {
    const request = await this.getRequestOrFail(requestId);
    if (request.createdById !== userId) throw new ForbiddenException('Only the requester can reject a bid');
    if (request.status !== RequestStatus.BIDDING_OPEN) {
      throw new BadRequestException('Bids can only be rejected while bidding is open');
    }

    const bid = await this.getBidOrFail(requestId, bidId);
    if (bid.status !== BidStatus.PENDING) throw new BadRequestException('This bid is not pending');

    bid.status = BidStatus.REJECTED;
    return this.bids.save(bid);
  }

  // ---------- helpers ----------

  private async getRequestOrFail(id: number) {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  private async getBidOrFail(requestId: number, bidId: number) {
    const bid = await this.bids.findOne({ where: { id: bidId, request: { id: requestId } } });
    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }

  /** New bids/edits are allowed only while status is bidding_open AND the deadline has not passed. */
  private assertAcceptingBids(request: NoteRequest) {
    if (request.status !== RequestStatus.BIDDING_OPEN) {
      throw new BadRequestException('This request is not open for bidding');
    }
    if (request.biddingDeadline && request.biddingDeadline < new Date()) {
      throw new BadRequestException('The bidding deadline has passed');
    }
  }
}
