import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/models/user.entity';
import { VideoLesson } from './video-lesson.entity';
import { VideoSegment } from './video-segment.entity';

@Entity('video_progress')
@Index('UQ_video_progress_student_segment', ['studentId', 'segmentId'], { unique: true })
export class VideoProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'lesson_id' })
  lessonId: string;

  @ManyToOne(() => VideoLesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: VideoLesson;

  @Column({ name: 'segment_id' })
  segmentId: string;

  @ManyToOne(() => VideoSegment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'segment_id' })
  segment: VideoSegment;

  @Column({ default: false })
  unlocked: boolean;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'quiz_score', type: 'float', nullable: true })
  quizScore: number;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


