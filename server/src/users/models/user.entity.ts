import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Absence } from '../../absence/models/absence.entity';
import { Assessment } from '../../assessment/models/assessment.entity';
import { RecoveryPlan } from '../../recovery/models/recovery-plan.entity';
import { Notification } from '../../notifications/models/notification.entity';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true, length: 50 })
  class: string;

  @Column({ length: 255 })
  school: string;

  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Absence, (absence) => absence.student)
  absences: Absence[];

  @OneToMany(() => Assessment, (assessment) => assessment.student)
  assessments: Assessment[];

  @OneToMany(() => RecoveryPlan, (plan) => plan.student)
  recoveryPlans: RecoveryPlan[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
