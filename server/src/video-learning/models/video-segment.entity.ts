import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { VideoLesson } from './video-lesson.entity';

@Entity('video_segments')
export class VideoSegment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id' })
  lessonId: string;

  @ManyToOne(() => VideoLesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: VideoLesson;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'learning_content', type: 'text', nullable: true })
  learningContent: string | null;

  @Column({ name: 'video_url', length: 1000, nullable: true })
  videoUrl: string;

  @Column({ name: 'start_time', type: 'int', default: 0 })
  startTime: number;

  @Column({ name: 'end_time', type: 'int' })
  endTime: number;

  @Column({ name: 'segment_order', type: 'int' })
  segmentOrder: number;

  @Column({ name: 'passing_score', type: 'int', default: 70 })
  passingScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
