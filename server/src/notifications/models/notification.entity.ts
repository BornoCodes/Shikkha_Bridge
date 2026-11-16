import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/models/user.entity';

export enum NotificationType {
  PLAN_GENERATED = 'plan_generated',
  PLAN_APPROVED = 'plan_approved',
  PLAN_REJECTED = 'plan_rejected',
  ASSESSMENT_READY = 'assessment_ready',
  ABSENCE_RECORDED = 'absence_recorded',
  MESSAGE = 'message',
  STREAK = 'streak',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.PLAN_GENERATED,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
