
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { Assessment } from '../models/assessment.entity';
import { AssessmentQuestion } from '../models/assessment-question.entity';
import { Topic } from '../../content/models/topic.entity';
import { GenerateAssessmentDto } from '../dto/generate-assessment.dto';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';
import { VideoLearningService } from '../../video-learning/services/video-learning.service';

interface QuizQuestionData {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: string;
}

@Injectable()
export class AssessmentService {
  private readonly aiServiceUrl =
    process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepo: Repository<Assessment>,

    @InjectRepository(AssessmentQuestion)
    private readonly questionRepo: Repository<AssessmentQuestion>,

    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,


    private readonly videoLearningService: VideoLearningService,
  ) {}

  async generateAssessment(
    studentId: string,
    dto: GenerateAssessmentDto,
  ) {
    const videoSegmentId = dto.videoSegmentId;

    const topic = await this.topicRepo.findOne({
      where: { id: dto.topicId },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const topicName = topic.name;
    const topicDesc = topic.description || '';

    let segmentTitle = '';
    let learningContent = topicDesc;

    if (videoSegmentId) {
      const access =
        await this.videoLearningService.checkSegmentAccess(
          studentId,
          videoSegmentId,
        );

      if (access.segment.lesson.topicId !== dto.topicId) {
        throw new BadRequestException(
          'Video segment does not belong to this topic',
        );
      }

      segmentTitle = access.segment.title;
      learningContent = access.segment.learningContent || '';

      if (!learningContent.trim()) {
        throw new BadRequestException(
          'This video segment has no learning content yet. Please ask your teacher to add the segment notes before generating its quiz.',
        );
      }
    }

    const questionCount = dto.questionCount || 5;

    let questionsData: QuizQuestionData[];

    try {
      const response = await axios.post(
        `${this.aiServiceUrl}/api/ai/generate-quiz`,
        {
          topic_name: topicName,
          topic_description: topicDesc,
          segment_title: segmentTitle,
          learning_content: learningContent,
          difficulty: dto.difficulty || 'medium',
          question_count: questionCount,
        },
        { timeout: 60000 },
      );

      questionsData = response.data?.data?.questions;
    } catch {
      throw new BadRequestException(
        'Quiz generation is currently unavailable. Please try again later. No placeholder questions have been created.',
      );
    }

    if (
      !Array.isArray(questionsData) ||
      questionsData.length !== questionCount ||
      questionsData.some((q) =>
        !q ||
        typeof q.question !== 'string' ||
        !q.question.trim() ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        q.options.some(
          (option) =>
            typeof option !== 'string' || !option.trim(),
        ) ||
        new Set(q.options.map((option) => option.trim())).size !== 4 ||
        typeof q.correct_answer !== 'string' ||
        !q.options.some(
          (option) =>
            option.trim() === q.correct_answer.trim(),
        )
      )
    ) {
      throw new BadRequestException(
        'The AI returned invalid quiz questions. Please try generating the quiz again.',
      );
    }

    const assessment = this.assessmentRepo.create({
      studentId,
      topicId: dto.topicId,
      videoSegmentId: videoSegmentId ?? null,
      totalQuestions: questionsData.length,
      score: 0,
      completed: false,
    });

    const savedAssessment = await this.assessmentRepo.save(assessment);

    const questions = questionsData.map((q) =>
      this.questionRepo.create({
        assessmentId: savedAssessment.id,
        question: q.question.trim(),
        options: q.options,
        correctAnswer: q.correct_answer,
        difficulty: q.difficulty || 'medium',
      }),
    );

    await this.questionRepo.save(questions);

    return this.getAssessmentById(savedAssessment.id, studentId);
  }
  async submitAssessment(
    dto: SubmitAssessmentDto,
    studentId: string,
  ) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id: dto.assessmentId },
      relations: ['questions', 'videoSegment'],
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (assessment.studentId !== studentId) {
      throw new ForbiddenException('You cannot submit this assessment');
    }

    if (assessment.completed) {
      throw new BadRequestException('Assessment has already been submitted');
    }

    if (
      !Array.isArray(dto.answers) ||
      dto.answers.length !== assessment.questions.length
    ) {
      throw new BadRequestException('Submit an answer for every question');
    }

    const submittedIds = new Set(
      dto.answers.map((answer) => answer.questionId),
    );

    if (
      submittedIds.size !== dto.answers.length ||
      assessment.questions.some((q) => !submittedIds.has(q.id))
    ) {
      throw new BadRequestException('Invalid or duplicate question answers');
    }

    let correctCount = 0;

    for (const answer of dto.answers) {
      const question = assessment.questions.find(
        (q) => q.id === answer.questionId,
      );

      if (!question) {
        throw new BadRequestException('Invalid question');
      }

      question.studentAnswer = answer.answer.trim();

      question.isCorrect =
        question.studentAnswer.toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();

      if (question.isCorrect) {
        correctCount++;
      }
    }

    const calculatedScore = Math.round(
      (correctCount / assessment.questions.length) * 100,
    );

    await this.questionRepo.save(assessment.questions);

    assessment.score = calculatedScore;
    assessment.completed = true;
    assessment.completedAt = new Date();

    const saved = await this.assessmentRepo.save(assessment);

    let videoProgress: object | null = null;
    if (assessment.videoSegmentId) {
      videoProgress =
        await this.videoLearningService.recordQuizResult(
          studentId,
          assessment.videoSegmentId,
          calculatedScore,
        );
    }

    return {
      id: saved.id,
      score: saved.score,
      totalQuestions: saved.totalQuestions,
      completed: saved.completed,
      completedAt: saved.completedAt,
      correctCount,
      videoProgress,
    };
  }

  async getAssessmentById(id: string, studentId: string) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id, studentId },
      relations: ['questions', 'topic', 'topic.subject'],
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return {
      ...assessment,
      questions: assessment.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        difficulty: question.difficulty,
        ...(assessment.completed
          ? {
              studentAnswer: question.studentAnswer,
              isCorrect: question.isCorrect,
            }
          : {}),
      })),
    };
  }

  async getStudentAssessments(
    studentId: string,
  ): Promise<Assessment[]> {
    return this.assessmentRepo.find({
      where: { studentId },
      relations: ['topic', 'topic.subject'],
      order: { createdAt: 'DESC' },
    });
  }
}
