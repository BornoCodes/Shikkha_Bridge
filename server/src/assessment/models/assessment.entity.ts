
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
import { VideoSegment } from '../../video-learning/models/video-segment.entity';

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

  @Column({
    name: 'video_segment_id',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  videoSegmentId: string | null;
  

  @ManyToOne(() => VideoSegment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'video_segment_id' })
  videoSegment: VideoSegment | null;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ name: 'total_questions', default: 5 })
  totalQuestions: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date | null;

  @OneToMany(() => AssessmentQuestion, (q) => q.assessment, { cascade: true })
  questions: AssessmentQuestion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
