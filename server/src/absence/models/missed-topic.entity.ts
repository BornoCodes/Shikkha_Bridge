import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Absence } from './absence.entity';
import { Topic } from '../../content/models/topic.entity';

@Entity('missed_topics')
export class MissedTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'absence_id' })
  absenceId: string;

  @ManyToOne(() => Absence, (absence) => absence.missedTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'absence_id' })
  absence: Absence;

  @Column({ name: 'topic_id' })
  topicId: string;

  @ManyToOne(() => Topic, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;
}
