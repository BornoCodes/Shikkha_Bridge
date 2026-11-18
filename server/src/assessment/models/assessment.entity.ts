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
import { Topic } from '../../content/models/topic.entity';
import { AssessmentQuestion } from './assessment-question.entity';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User, (user) => user.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'topic_id' })
  topicId: string;

  @ManyToOne(() => Topic, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ name: 'total_questions', default: 5 })
  totalQuestions: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;

  @OneToMany(() => AssessmentQuestion, (q) => q.assessment, { cascade: true })
  questions: AssessmentQuestion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
