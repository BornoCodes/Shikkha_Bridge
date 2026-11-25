
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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
    @InjectRepository(NoteRequest)
    private readonly requests: Repository<NoteRequest>,

    @InjectRepository(NoteRequestVote)
    private readonly votes: Repository<NoteRequestVote>,

    @InjectRepository(Bid)
    private readonly bids: Repository<Bid>,

    private readonly dataSource: DataSource,
  ) {}

  // A note writer submits an offer.
  async placeBid(
    writerId: string,
    requestId: number,
    dto: PlaceBidDto,
  ) {
    const request = await this.getRequestOrFail(requestId);

    this.assertAcceptingBids(request);

    // A requester cannot bid on their own demand.
    const isRequester = await this.votes.count({
      where: {
        request: { id: requestId },
        studentId: writerId,
      },
    });

    if (isRequester > 0) {
      throw new ForbiddenException(
        'Requesters cannot bid on their own request',
      );
    }

    const existing = await this.bids.findOne({
      where: {
        request: { id: requestId },
        writerId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'You already placed a bid. Edit it instead.',
      );
    }

    return this.bids.save(
      this.bids.create({
        ...dto,
        writerId,
        request,
      }),
    );
  }

  // Edit your own pending bid while bidding is open.
  async updateBid(
    writerId: string,
    requestId: number,
    bidId: number,
    dto: UpdateBidDto,
  ) {
    const request = await this.getRequestOrFail(requestId);

    this.assertAcceptingBids(request);

    const bid = await this.getBidOrFail(requestId, bidId);

    if (bid.writerId !== writerId) {
      throw new ForbiddenException('This is not your bid');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException(
        'This bid can no longer be edited',
      );
    }

    Object.assign(bid, dto);

    return this.bids.save(bid);
  }

  // Withdraw your own pending bid.
  async withdrawBid(
    writerId: string,
    requestId: number,
    bidId: number,
  ) {
    const request = await this.getRequestOrFail(requestId);

    this.assertAcceptingBids(request);

    const bid = await this.getBidOrFail(requestId, bidId);

    if (bid.writerId !== writerId) {
      throw new ForbiddenException('This is not your bid');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException(
        'This bid cannot be withdrawn',
      );
    }

    bid.status = BidStatus.WITHDRAWN;

    return this.bids.save(bid);
  }

  // Bids are visible once bidding has opened.
  async listBids(requestId: number) {
    const request = await this.getRequestOrFail(requestId);

    if (request.status === RequestStatus.COLLECTING) {
      throw new BadRequestException(
        'Bidding has not opened yet',
      );
    }

    return this.bids.find({
      where: { request: { id: requestId } },
      order: { price: 'ASC' },
    });
  }

  // The requester accepts one bid.
  // All other pending bids are rejected.
  async acceptBid(
    userId: string,
    requestId: number,
    bidId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const request = await manager.findOne(NoteRequest, {
        where: { id: requestId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      if (request.createdById !== userId) {
        throw new ForbiddenException(
          'Only the requester can accept a bid',
        );
      }

      if (request.status !== RequestStatus.BIDDING_OPEN) {
        throw new BadRequestException(
          'A bid can only be accepted while bidding is open',
        );
      }

      const allBids = await manager.find(Bid, {
        where: { request: { id: requestId } },
      });

      const chosen = allBids.find(
        (bid) => bid.id === bidId,
      );

      if (!chosen) {
        throw new NotFoundException('Bid not found');
      }

      if (chosen.status !== BidStatus.PENDING) {
        throw new BadRequestException(
          'This bid is not available',
        );
      }

      for (const bid of allBids) {
        if (bid.status === BidStatus.WITHDRAWN) {
          continue;
        }

        bid.status =
          bid.id === bidId
            ? BidStatus.ACCEPTED
            : BidStatus.REJECTED;
      }

      await manager.save(allBids);

      request.status = RequestStatus.BID_ACCEPTED;
      request.acceptedBidId = bidId;

      await manager.save(request);

      // TODO (wallet teammate): hold the agreed credits in escrow here.

      return {
        requestId,
        acceptedBidId: bidId,
        status: request.status,
      };
    });
  }

  // Reject one bid without choosing a winner.
  async rejectBid(
    userId: string,
    requestId: number,
    bidId: number,
  ) {
    const request = await this.getRequestOrFail(requestId);

    if (request.createdById !== userId) {
      throw new ForbiddenException(
        'Only the requester can reject a bid',
      );
    }

    if (request.status !== RequestStatus.BIDDING_OPEN) {
      throw new BadRequestException(
        'Bids can only be rejected while bidding is open',
      );
    }

    const bid = await this.getBidOrFail(requestId, bidId);

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException(
        'This bid is not pending',
      );
    }

    bid.status = BidStatus.REJECTED;

    return this.bids.save(bid);
  }

  // Find a request or return an error.
  private async getRequestOrFail(id: number) {
    const request = await this.requests.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  // Find a bid belonging to the specified request.
  private async getBidOrFail(
    requestId: number,
    bidId: number,
  ) {
    const bid = await this.bids.findOne({
      where: {
        id: bidId,
        request: { id: requestId },
      },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    return bid;
  }

  // New bids and edits are allowed only while bidding is open
  // and the deadline has not passed.
  private assertAcceptingBids(request: NoteRequest) {
    if (request.status !== RequestStatus.BIDDING_OPEN) {
      throw new BadRequestException(
        'This request is not open for bidding',
      );
    }

    if (
      request.biddingDeadline &&
      request.biddingDeadline < new Date()
    ) {
      throw new BadRequestException(
        'The bidding deadline has passed',
      );
    }
  }
}
