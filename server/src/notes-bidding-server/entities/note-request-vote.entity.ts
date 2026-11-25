
// MODEL: one row = one student asking for these notes.
// The unique pair stops the same student from being counted twice.

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { NoteRequest } from './note-request.entity';

@Entity('note_request_votes')
@Unique(['request', 'studentId'])
export class NoteRequestVote {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => NoteRequest, (request) => request.votes, {
    onDelete: 'CASCADE',
  })
  request!: NoteRequest;

  // Updated project user IDs are UUID strings.
  @Column({ type: 'varchar', length: 36 })
  studentId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

