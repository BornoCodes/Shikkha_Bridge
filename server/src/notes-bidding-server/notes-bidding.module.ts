import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteRequestsController } from './note-requests.controller';
import { BidsController } from './bids.controller';
import { NoteRequestsService } from './note-requests.service';
import { BidsService } from './bids.service';
import { NoteRequest } from './entities/note-request.entity';
import { NoteRequestVote } from './entities/note-request-vote.entity';
import { Bid } from './entities/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteRequest, NoteRequestVote, Bid])],
  controllers: [NoteRequestsController, BidsController],
  providers: [NoteRequestsService, BidsService],
})
export class NotesBiddingModule {}
