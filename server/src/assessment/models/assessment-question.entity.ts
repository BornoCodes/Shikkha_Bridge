import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity('assessment_questions')
export class AssessmentQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assessment_id' })
  assessmentId: string;

  @ManyToOne(() => Assessment, (a) => a.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'json' })
  options: string[];

  @Column({ name: 'correct_answer' })
  correctAnswer: string;

  @Column({ nullable: true })
  difficulty: string;

  @Column({ name: 'student_answer', nullable: true })
  studentAnswer: string;

  @Column({ name: 'is_correct', nullable: true })
  isCorrect: boolean;
}
