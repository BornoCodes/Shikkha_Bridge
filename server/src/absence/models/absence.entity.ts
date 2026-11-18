import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/models/user.entity';
import { MissedTopic } from './missed-topic.entity';

export enum AbsenceReason {
  FLOOD = 'flood',
  ILLNESS = 'illness',
  FAMILY = 'family',
  OTHER = 'other',
}

@Entity('absences')
export class Absence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User, (user) => user.absences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'enum',
    enum: AbsenceReason,
    default: AbsenceReason.OTHER,
  })
  reason: AbsenceReason;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => MissedTopic, (missed) => missed.absence, { cascade: true })
  missedTopics: MissedTopic[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
