// MODEL (MVC): stores the demand for notes on a topic.
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RequestStatus } from './enums';
import { NoteRequestVote } from './note-request-vote.entity';
import { Bid } from './bid.entity';

@Entity('note_requests')
export class NoteRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  topic: string;

  // lowercase + trimmed topic, so "Algebra" and " algebra " are the same demand
  @Column({ length: 200 })
  topicKey: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.COLLECTING })
  status: RequestStatus;

  // how many distinct students are needed before bidding opens
  @Column({ type: 'int' })
  threshold: number;

  // the student who created the request. This student accepts/rejects bids.
  @Column()
  createdById: number;

  @Column({ type: 'datetime', nullable: true })
  biddingDeadline: Date | null;

  @Column({ type: 'int', nullable: true })
  acceptedBidId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => NoteRequestVote, (v) => v.request)
  votes: NoteRequestVote[];

  @OneToMany(() => Bid, (b) => b.request)
  bids: Bid[];
}
