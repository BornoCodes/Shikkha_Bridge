
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { NoteRequest } from './note-request.entity';
import { BidStatus } from './enums';

@Entity('bids')
@Unique(['request', 'writerId'])
export class Bid {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => NoteRequest, (request) => request.bids, {
    onDelete: 'CASCADE',
  })
  request!: NoteRequest;

  // The writer's ID is a UUID string in the updated project.
  @Column({ type: 'varchar', length: 36 })
  writerId!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price!: number;

  @Column({ type: 'int' })
  deliveryDays!: number;

  @Column({ type: 'text' })
  pitch!: string;

  @Column({ type: 'text' })
  samplePage!: string;

  @Column({
    type: 'enum',
    enum: BidStatus,
    default: BidStatus.PENDING,
  })
  status!: BidStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

