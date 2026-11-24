// MODEL: one row = one student asking for these notes.
// The unique pair stops the same student from being counted twice.
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { NoteRequest } from './note-request.entity';

@Entity('note_request_votes')
@Unique(['request', 'studentId'])
export class NoteRequestVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NoteRequest, (r) => r.votes, { onDelete: 'CASCADE' })
  request: NoteRequest;

  @Column()
  studentId: number;

  @CreateDateColumn()
  createdAt: Date;
}
