import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/models/user.entity';
import { RecoveryPlanItem } from './recovery-plan-item.entity';

export enum PlanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('recovery_plans')
export class RecoveryPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User, (u) => u.recoveryPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'teacher_id', nullable: true })
  teacherId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.PENDING,
  })
  status: PlanStatus;

  @Column({ name: 'ai_generated_plan', type: 'json', nullable: true })
  aiGeneratedPlan: any;

  @Column({ name: 'teacher_notes', type: 'text', nullable: true })
  teacherNotes: string;

  @Column({ name: 'total_hours', type: 'float', default: 0 })
  totalHours: number;

  @OneToMany(() => RecoveryPlanItem, (item) => item.plan, { cascade: true })
  items: RecoveryPlanItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
