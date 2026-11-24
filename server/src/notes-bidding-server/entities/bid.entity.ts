// MODEL: a note writer's offer on a request.
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn,
} from 'typeorm';
import { NoteRequest } from './note-request.entity';
import { BidStatus } from './enums';

@Entity('bids')
@Unique(['request', 'writerId']) // one bid per writer per request
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NoteRequest, (r) => r.bids, { onDelete: 'CASCADE' })
  request: NoteRequest;

  @Column()
  writerId: number;

  // MySQL returns DECIMAL as a string, so convert it to a number
  @Column({
    type: 'decimal', precision: 10, scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  price: number;

  @Column({ type: 'int' })
  deliveryDays: number;

  @Column({ type: 'text' })
  pitch: string;

  // text of one sample page (file upload can come later)
  @Column({ type: 'text' })
  samplePage: string;

  @Column({ type: 'enum', enum: BidStatus, default: BidStatus.PENDING })
  status: BidStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
