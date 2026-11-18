import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Assessment } from '../models/assessment.entity';
import { AssessmentQuestion } from '../models/assessment-question.entity';
import { Topic } from '../../content/models/topic.entity';
import { GenerateAssessmentDto } from '../dto/generate-assessment.dto';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';

@Injectable()
export class AssessmentService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepo: Repository<Assessment>,
    @InjectRepository(AssessmentQuestion)
    private readonly questionRepo: Repository<AssessmentQuestion>,
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  async generateAssessment(studentId: string, dto: GenerateAssessmentDto): Promise<Assessment> {
    const topic = await this.topicRepo.findOne({ where: { id: dto.topicId } });
    const topicName = topic?.name || 'Class Topic';
    const topicDesc = topic?.description || '';

    // Call FastAPI AI service for quiz generation
    let questionsData = [];
    try {
      const response = await axios.post(`${this.aiServiceUrl}/api/ai/generate-quiz`, {
        topic_name: topicName,
        topic_description: topicDesc,
        difficulty: dto.difficulty || 'medium',
        question_count: dto.questionCount || 5,
      });
      questionsData = response.data?.data?.questions || [];
    } catch {
      // Fallback questions if AI service is offline
      questionsData = [
        {
          question: `Foundational check: Which best defines the principles of ${topicName}?`,
          options: ['Primary Definition A', 'Alternate Rule B', 'Context C', 'Exception D'],
          correct_answer: 'Primary Definition A',
          difficulty: 'medium',
        },
        {
          question: `Application question for ${topicName}: How do you solve for unknown variables?`,
          options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'],
          correct_answer: 'Method 1',
          difficulty: 'medium',
        },
      ];
    }

    const assessment = this.assessmentRepo.create({
      studentId,
      topicId: dto.topicId,
      totalQuestions: questionsData.length,
      score: 0,
      completed: false,
    });
    const savedAssessment = await this.assessmentRepo.save(assessment);

    const questions = questionsData.map((q) =>
      this.questionRepo.create({
        assessmentId: savedAssessment.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer || q.options[0],
        difficulty: q.difficulty || 'medium',
      }),
    );
    await this.questionRepo.save(questions);

    return this.getAssessmentById(savedAssessment.id);
  }

  async submitAssessment(dto: SubmitAssessmentDto): Promise<Assessment> {
    const assessment = await this.getAssessmentById(dto.assessmentId);
    let correctCount = 0;

    for (const ans of dto.answers) {
      const q = assessment.questions.find((item) => item.id === ans.questionId);
      if (q) {
        q.studentAnswer = ans.answer;
        q.isCorrect = q.studentAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        if (q.isCorrect) correctCount++;
        await this.questionRepo.save(q);
      }
    }

    const calculatedScore = assessment.questions.length > 0
      ? Math.round((correctCount / assessment.questions.length) * 100)
      : 0;

    assessment.score = calculatedScore;
    assessment.completed = true;
    assessment.completedAt = new Date();

    return this.assessmentRepo.save(assessment);
  }

  async getAssessmentById(id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepo.findOne({
      where: { id },
      relations: ['questions', 'topic', 'topic.subject'],
    });
    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  async getStudentAssessments(studentId: string): Promise<Assessment[]> {
    return this.assessmentRepo.find({
      where: { studentId },
      relations: ['topic', 'topic.subject'],
      order: { createdAt: 'DESC' },
    });
  }
}
