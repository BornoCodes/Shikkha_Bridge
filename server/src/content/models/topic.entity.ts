import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Subject } from './subject.entity';
import { Content } from './content.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'subject_id' })
  subjectId!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ name: 'week_number', type: 'int' })
  weekNumber!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Subject, (subject) => subject.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;

  @OneToMany(() => Content, (content) => content.topic)
  content!: Content[];
}