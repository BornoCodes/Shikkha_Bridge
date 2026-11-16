import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecoveryPlan } from './recovery-plan.entity';
import { Topic } from '../../content/models/topic.entity';
import { Content } from '../../content/models/content.entity';

@Entity('recovery_plan_items')
export class RecoveryPlanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plan_id' })
  planId: string;

  @ManyToOne(() => RecoveryPlan, (plan) => plan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: RecoveryPlan;

  @Column({ name: 'topic_id', nullable: true })
  topicId: string;

  @ManyToOne(() => Topic, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @Column({ name: 'content_id', nullable: true })
  contentId: string;

  @ManyToOne(() => Content, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @Column({ type: 'int', default: 1 })
  order: number;

  @Column({ name: 'estimated_hours', type: 'float', default: 1 })
  estimatedHours: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;
}
