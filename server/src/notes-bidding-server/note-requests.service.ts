
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { NoteRequest } from './entities/note-request.entity';
import { NoteRequestVote } from './entities/note-request-vote.entity';
import { RequestStatus } from './entities/enums';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class NoteRequestsService {
  private readonly threshold = Number(
    process.env.BIDDING_THRESHOLD ?? 10,
  );

  private readonly windowHours = Number(
    process.env.BIDDING_WINDOW_HOURS ?? 48,
  );

  constructor(
    @InjectRepository(NoteRequest)
    private readonly requests: Repository<NoteRequest>,

    @InjectRepository(NoteRequestVote)
    private readonly votes: Repository<NoteRequestVote>,

    private readonly dataSource: DataSource,
  ) {}

  async requestNotes(studentId: string, dto: CreateRequestDto) {
    const topicKey = dto.topic.trim().toLowerCase();

    return this.dataSource.transaction(async (manager) => {
      let request = await manager.findOne(NoteRequest, {
        where: {
          topicKey,
          status: In([
            RequestStatus.COLLECTING,
            RequestStatus.BIDDING_OPEN,
          ]),
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!request) {
        request = await manager.save(
          manager.create(NoteRequest, {
            topic: dto.topic.trim(),
            topicKey,
            description: dto.description ?? null,
            threshold: this.threshold,
            createdById: studentId,
          }),
        );
      }

      if (request.status === RequestStatus.BIDDING_OPEN) {
        throw new ConflictException(
          'Bidding for this topic has already started',
        );
      }

      const already = await manager.findOne(NoteRequestVote, {
        where: {
          request: { id: request.id },
          studentId,
        },
      });

      if (already) {
        throw new ConflictException(
          'You already requested this topic',
        );
      }

      await manager.save(
        manager.create(NoteRequestVote, {
          request,
          studentId,
        }),
      );

      const count = await manager.count(NoteRequestVote, {
        where: { request: { id: request.id } },
      });

      if (count >= request.threshold) {
        request.status = RequestStatus.BIDDING_OPEN;

        request.biddingDeadline = new Date(
          Date.now() + this.windowHours * 3600 * 1000,
        );

        await manager.save(request);
      }

      return {
        ...request,
        requestCount: count,
      };
    });
  }

  async cancelRequest(studentId: string, requestId: number) {
    return this.dataSource.transaction(async (manager) => {
      const request = await manager.findOne(NoteRequest, {
        where: { id: requestId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      if (request.status !== RequestStatus.COLLECTING) {
        throw new BadRequestException(
          'Too late to cancel: bidding has already opened',
        );
      }

      const vote = await manager.findOne(NoteRequestVote, {
        where: {
          request: { id: requestId },
          studentId,
        },
      });

      if (!vote) {
        throw new NotFoundException(
          'You have not requested this topic',
        );
      }

      await manager.remove(vote);

      const requestCount = await manager.count(NoteRequestVote, {
        where: { request: { id: requestId } },
      });

      return { requestCount };
    });
  }

  async list(status?: RequestStatus) {
    const requests = await this.requests.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      requests.map(async (request) => ({
        ...request,
        requestCount: await this.votes.count({
          where: { request: { id: request.id } },
        }),
      })),
    );
  }

  async getOne(id: number, userId: string) {
    const request = await this.requests.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const requestCount = await this.votes.count({
      where: { request: { id } },
    });

    const hasRequested =
      (await this.votes.count({
        where: {
          request: { id },
          studentId: userId,
        },
      })) > 0;

    return {
      ...request,
      requestCount,
      hasRequested,
      isOwner: request.createdById === userId,
    };
  }
}
