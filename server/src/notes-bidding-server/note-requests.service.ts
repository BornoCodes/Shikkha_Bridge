// FEATURE 2: request threshold.
// Business logic lives here (not in the controller, not in React).
import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { NoteRequest } from './entities/note-request.entity';
import { NoteRequestVote } from './entities/note-request-vote.entity';
import { RequestStatus } from './entities/enums';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class NoteRequestsService {
  // set in .env, e.g. BIDDING_THRESHOLD=2 while testing
  private readonly threshold = Number(process.env.BIDDING_THRESHOLD ?? 10);
  private readonly windowHours = Number(process.env.BIDDING_WINDOW_HOURS ?? 48);

  constructor(
    @InjectRepository(NoteRequest) private readonly requests: Repository<NoteRequest>,
    @InjectRepository(NoteRequestVote) private readonly votes: Repository<NoteRequestVote>,
    private readonly dataSource: DataSource,
  ) {}

  /** Step 1 + 2: student clicks "Request Notes"; count goes up by one unique student. */
  async requestNotes(studentId: number, dto: CreateRequestDto) {
    const topicKey = dto.topic.trim().toLowerCase();

    return this.dataSource.transaction(async (m) => {
      // Lock the row so two students clicking at the same moment can't both miss the threshold.
      let request = await m.findOne(NoteRequest, {
        where: { topicKey, status: In([RequestStatus.COLLECTING, RequestStatus.BIDDING_OPEN]) },
        lock: { mode: 'pessimistic_write' },
      });

      if (!request) {
        request = await m.save(
          m.create(NoteRequest, {
            topic: dto.topic.trim(),
            topicKey,
            description: dto.description ?? null,
            threshold: this.threshold,
            createdById: studentId,
          }),
        );
      }

      if (request.status === RequestStatus.BIDDING_OPEN) {
        throw new ConflictException('Bidding for this topic has already started');
      }

      const already = await m.findOne(NoteRequestVote, {
        where: { request: { id: request.id }, studentId },
      });
      if (already) throw new ConflictException('You already requested this topic');

      await m.save(m.create(NoteRequestVote, { request, studentId }));

      const count = await m.count(NoteRequestVote, { where: { request: { id: request.id } } });

      // Threshold reached: open bidding and set the deadline.
      if (count >= request.threshold) {
        request.status = RequestStatus.BIDDING_OPEN;
        request.biddingDeadline = new Date(Date.now() + this.windowHours * 3600 * 1000);
        await m.save(request);
        // TODO (notifications teammate): notify requesters + eligible writers here
      }

      return { ...request, requestCount: count };
    });
  }

  /** "Cancel Request": allowed only while still collecting requests. */
  async cancelRequest(studentId: number, requestId: number) {
    return this.dataSource.transaction(async (m) => {
      const request = await m.findOne(NoteRequest, {
        where: { id: requestId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!request) throw new NotFoundException('Request not found');
      if (request.status !== RequestStatus.COLLECTING) {
        throw new BadRequestException('Too late to cancel: bidding has already opened');
      }

      const vote = await m.findOne(NoteRequestVote, {
        where: { request: { id: requestId }, studentId },
      });
      if (!vote) throw new NotFoundException('You have not requested this topic');

      await m.remove(vote);
      const requestCount = await m.count(NoteRequestVote, { where: { request: { id: requestId } } });
      return { requestCount };
    });
  }

  async list(status?: RequestStatus) {
    const requests = await this.requests.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
    // attach the counter for each request (fine for a small project)
    return Promise.all(
      requests.map(async (r) => ({
        ...r,
        requestCount: await this.votes.count({ where: { request: { id: r.id } } }),
      })),
    );
  }

  /** One request + counter + "did I request it?" + "am I the owner?" for the UI. */
  async getOne(id: number, userId: number) {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');

    const requestCount = await this.votes.count({ where: { request: { id } } });
    const hasRequested =
      (await this.votes.count({ where: { request: { id }, studentId: userId } })) > 0;

    return { ...request, requestCount, hasRequested, isOwner: request.createdById === userId };
  }
}
