import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Topic } from './topic.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'class_level', length: 50 })
  classLevel: string;

  @OneToMany(() => Topic, (topic) => topic.subject)
  topics: Topic[];
}
