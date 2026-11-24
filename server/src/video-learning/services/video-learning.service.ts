
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VideoLesson } from '../models/video-lesson.entity';
import { VideoSegment } from '../models/video-segment.entity';
import { VideoProgress } from '../models/video-progress.entity';
import { Topic } from '../../content/models/topic.entity';

@Injectable()
export class VideoLearningService {
  constructor(
    @InjectRepository(VideoLesson)
    private readonly lessonRepo: Repository<VideoLesson>,

    @InjectRepository(VideoSegment)
    private readonly segmentRepo: Repository<VideoSegment>,

    @InjectRepository(VideoProgress)
    private readonly progressRepo: Repository<VideoProgress>,

    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  // Get all published video lessons
  async getPublishedLessons() {
    return this.lessonRepo.find({
      where: { published: true },
      relations: ['topic'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get one published lesson with its ordered segments
  async getLessonById(lessonId: string) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId, published: true },
      relations: ['topic'],
    });

    if (!lesson) {
      throw new NotFoundException('Video lesson not found');
    }

    const segments = await this.segmentRepo.find({
      where: { lessonId },
      order: { segmentOrder: 'ASC' },
    });

    return { ...lesson, segments };
  }

  // Get lessons belonging to a teacher
  async getTeacherLessons(teacherId: string) {
  const lessons = await this.lessonRepo.find({
    where: { teacherId },
    relations: ['topic'],
    order: { createdAt: 'DESC' },
  });

  return Promise.all(
    lessons.map(async (lesson) => {
      const segments = await this.segmentRepo.find({
        where: { lessonId: lesson.id },
        order: { segmentOrder: 'ASC' },
      });

      return {
        ...lesson,
        segments,
      };
    }),
   );
  }

  // Create a video lesson
  async createLesson(
    teacherId: string,
    dto: {
      topicId: string;
      title: string;
      description?: string;
      videoUrl: string;
    },
  ) {
    if (
      !dto.topicId ||
      !dto.title?.trim() ||
      !dto.videoUrl?.trim()
    ) {
      throw new BadRequestException(
        'Topic, title and video URL are required',
      );
    }

    if (dto.title.trim().length > 255 || dto.videoUrl.trim().length > 1000) {
      throw new BadRequestException('Title or video URL is too long');
    }

    const topic = await this.topicRepo.findOne({
      where: { id: dto.topicId },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const lesson = this.lessonRepo.create({
      teacherId,
      topicId: dto.topicId,
      title: dto.title.trim(),
      description: dto.description?.trim() || '',
      videoUrl: dto.videoUrl.trim(),
      published: false,
    });

    return this.lessonRepo.save(lesson);
  }

  // Verify that a teacher owns a lesson
  private async getTeacherLesson(
    teacherId: string,
    lessonId: string,
  ) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Video lesson not found');
    }

    if (lesson.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You do not own this video lesson',
      );
    }

    return lesson;
  }

  // Update only the learning content of an existing segment
  async updateSegmentContent(
    teacherId: string,
    segmentId: string,
    learningContent: string,
  ) {
    const segment = await this.segmentRepo.findOne({
      where: { id: segmentId },
    });

    if (!segment) {
      throw new NotFoundException('Video segment not found');
    }

    await this.getTeacherLesson(teacherId, segment.lessonId);

    if (
      typeof learningContent !== 'string' ||
      !learningContent.trim() ||
      learningContent.trim().length > 20000
    ) {
      throw new BadRequestException(
        'Learning content must contain between 1 and 20000 characters',
      );
    }

    segment.learningContent = learningContent.trim();

    return this.segmentRepo.save(segment);
  }
  // Create a segment inside a teacher's lesson
  async createSegment(
    teacherId: string,
    lessonId: string,
    dto: {
      title: string;
        learningContent?: string;
      startTime: number;
      endTime: number;
      segmentOrder: number;
      passingScore?: number;
    },
  ) {
    const lesson = await this.getTeacherLesson(
      teacherId,
      lessonId,
    );

    if (lesson.published) {
      throw new BadRequestException(
        'Cannot modify a published lesson',
      );
    }

    if (!dto.title?.trim() || dto.title.trim().length > 255) {
      throw new BadRequestException('A valid segment title is required');
    }

    if (
      !Number.isInteger(dto.startTime) ||
      !Number.isInteger(dto.endTime) ||
      dto.startTime < 0 ||
      dto.endTime <= dto.startTime
    ) {
      throw new BadRequestException('Invalid segment start or end time');
    }

    if (
      !Number.isInteger(dto.segmentOrder) ||
      dto.segmentOrder < 1
    ) {
      throw new BadRequestException('Segment order must be a positive integer');
    }

    const passingScore = dto.passingScore ?? 70;

    if (
      !Number.isInteger(passingScore) ||
      passingScore < 0 ||
      passingScore > 100
    ) {
      throw new BadRequestException(
        'Passing score must be between 0 and 100',
      );
    }

    const existingSegments = await this.segmentRepo.find({
      where: { lessonId },
    });

    if (
      existingSegments.some(
        (segment) => segment.segmentOrder === dto.segmentOrder,
      )
    ) {
      throw new BadRequestException(
        'This segment order is already in use',
      );
    }

    const overlaps = existingSegments.some(
      (segment) =>
        dto.startTime < segment.endTime &&
        dto.endTime > segment.startTime,
    );

    if (overlaps) {
      throw new BadRequestException(
        'Video segments cannot overlap',
      );
    }

    const segment = this.segmentRepo.create({
      lessonId,
      title: dto.title.trim(),
        learningContent: dto.learningContent?.trim() || null,
      startTime: dto.startTime,
      endTime: dto.endTime,
      segmentOrder: dto.segmentOrder,
      passingScore,
    });

    return this.segmentRepo.save(segment);
  }

  // Publish a teacher's lesson
  async publishLesson(
    teacherId: string,
    lessonId: string,
  ) {
    const lesson = await this.getTeacherLesson(
      teacherId,
      lessonId,
    );

    if (lesson.published) {
      throw new BadRequestException('Lesson is already published');
    }

    const segments = await this.segmentRepo.find({
      where: { lessonId },
      order: { segmentOrder: 'ASC' },
    });

    if (segments.length === 0) {
      throw new BadRequestException(
        'Add at least one segment before publishing',
      );
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (
        !segment.title?.trim() ||
        segment.startTime < 0 ||
        segment.endTime <= segment.startTime ||
        segment.passingScore < 0 ||
        segment.passingScore > 100
      ) {
        throw new BadRequestException(
          'The lesson contains an invalid segment',
        );
      }

      if (
        i > 0 &&
        segment.startTime < segments[i - 1].endTime
      ) {
        throw new BadRequestException(
          'The lesson contains overlapping segments',
        );
      }
    }

    lesson.published = true;

    return this.lessonRepo.save(lesson);
  }

  // Get student progress for a lesson
  async getLessonProgress(studentId: string, lessonId: string) {
    await this.getLessonById(lessonId);

    const segments = await this.segmentRepo.find({
      where: { lessonId },
      order: { segmentOrder: 'ASC' },
    });

    const progress = await this.progressRepo.find({
      where: { studentId, lessonId },
      relations: ['segment'],
    });

    const progressMap = new Map(
      progress.map((item) => [item.segmentId, item]),
    );

    return segments.map((segment, index) => {
      const record = progressMap.get(segment.id);

      return {
        segmentId: segment.id,
        title: segment.title,
        segmentOrder: segment.segmentOrder,
        passingScore: segment.passingScore,
        unlocked: index === 0 || record?.unlocked === true,
        completed: record?.completed === true,
        quizScore: record?.quizScore ?? null,
      };
    });
  }

  // Check whether a student can access a segment
  async checkSegmentAccess(studentId: string, segmentId: string) {
    const segment = await this.segmentRepo.findOne({
      where: { id: segmentId },
      relations: ['lesson'],
    });

    if (!segment || !segment.lesson.published) {
      throw new NotFoundException('Video segment not found');
    }

    const previousSegment = await this.segmentRepo
      .createQueryBuilder('segment')
      .where('segment.lessonId = :lessonId', {
        lessonId: segment.lessonId,
      })
      .andWhere('segment.segmentOrder < :segmentOrder', {
        segmentOrder: segment.segmentOrder,
      })
      .orderBy('segment.segmentOrder', 'DESC')
      .getOne();

    if (!previousSegment) {
      return { allowed: true, segment };
    }

    const previousProgress = await this.progressRepo.findOne({
      where: {
        studentId,
        lessonId: segment.lessonId,
        segmentId: previousSegment.id,
      },
    });

    if (!previousProgress?.completed) {
      throw new ForbiddenException(
        'Complete the previous segment quiz before continuing',
      );
    }

    return { allowed: true, segment };
  }

  // Record that a student has started an unlocked segment
  async startSegment(studentId: string, segmentId: string) {
    const access = await this.checkSegmentAccess(studentId, segmentId);
    const segment = access.segment;

    let progress = await this.progressRepo.findOne({
      where: {
        studentId,
        lessonId: segment.lessonId,
        segmentId,
      },
    });

    if (!progress) {
      progress = this.progressRepo.create({
        studentId,
        lessonId: segment.lessonId,
        segmentId,
        unlocked: true,
        completed: false,
      });

      progress = await this.progressRepo.save(progress);
    } else if (!progress.unlocked) {
      progress.unlocked = true;
      progress = await this.progressRepo.save(progress);
    }

    return {
      message: 'Segment access granted',
      progress,
    };
  }

  // Record quiz result and unlock next segment when passed
  async recordQuizResult(
    studentId: string,
    segmentId: string,
    score: number,
  ) {
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new BadRequestException('Score must be between 0 and 100');
    }

    const access = await this.checkSegmentAccess(studentId, segmentId);
    const segment = access.segment;

    let progress = await this.progressRepo.findOne({
      where: {
        studentId,
        lessonId: segment.lessonId,
        segmentId,
      },
    });

    if (!progress) {
      progress = this.progressRepo.create({
        studentId,
        lessonId: segment.lessonId,
        segmentId,
        unlocked: true,
        completed: false,
      });
    }

    progress.quizScore = score;

    if (score >= segment.passingScore) {
      progress.completed = true;
      progress.unlocked = true;
      progress.completedAt = new Date();
    }

    await this.progressRepo.save(progress);

    let nextSegment: VideoSegment | null = null;

    if (progress.completed) {
      nextSegment = await this.segmentRepo
        .createQueryBuilder('segment')
        .where('segment.lessonId = :lessonId', {
          lessonId: segment.lessonId,
        })
        .andWhere('segment.segmentOrder > :segmentOrder', {
          segmentOrder: segment.segmentOrder,
        })
        .orderBy('segment.segmentOrder', 'ASC')
        .getOne();

      if (nextSegment) {
        let nextProgress = await this.progressRepo.findOne({
          where: {
            studentId,
            lessonId: segment.lessonId,
            segmentId: nextSegment.id,
          },
        });

        if (!nextProgress) {
          nextProgress = this.progressRepo.create({
            studentId,
            lessonId: segment.lessonId,
            segmentId: nextSegment.id,
            unlocked: true,
            completed: false,
          });
        } else {
          nextProgress.unlocked = true;
        }

        await this.progressRepo.save(nextProgress);
      }
    }

    return {
      score,
      passingScore: segment.passingScore,
      passed: progress.completed,
      nextSegmentUnlocked: !!nextSegment,
      nextSegmentId: nextSegment?.id ?? null,
      progress,
    };
  }
}
