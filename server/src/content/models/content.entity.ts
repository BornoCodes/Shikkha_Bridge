import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { User } from '../../users/models/user.entity';

export enum ContentType {
  VIDEO = 'video',
  NOTE = 'note',
  EXERCISE = 'exercise',
  ARTICLE = 'article',
}

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic_id' })
  topicId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column({ length: 1000 })
  url: string;

  @Column({ name: 'thumbnail_url', nullable: true, length: 1000 })
  thumbnailUrl: string;

  @Column({ name: 'uploaded_by_id' })
  uploadedById: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Topic, (topic) => topic.content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;
}
