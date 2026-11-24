import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Request,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/models/user.entity';
import { VideoLearningService } from '../services/video-learning.service';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Controller('video-learning')
@UseGuards(JwtAuthGuard)
export class VideoLearningController {
  constructor(
    private readonly videoLearningService: VideoLearningService,
  ) {}

  // Student routes

  @Get('lessons')
  async getPublishedLessons() {
    return this.videoLearningService.getPublishedLessons();
  }

  @Get('lessons/:lessonId')
  async getLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.videoLearningService.getLessonById(lessonId);
  }

  @Get('lessons/:lessonId/progress')
  async getLessonProgress(
    @Request() req: AuthenticatedRequest,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.videoLearningService.getLessonProgress(
      req.user.id,
      lessonId,
    );
  }

  @Post('segments/:segmentId/start')
  async startSegment(
    @Request() req: AuthenticatedRequest,
    @Param('segmentId', ParseUUIDPipe) segmentId: string,
  ) {
    return this.videoLearningService.startSegment(
      req.user.id,
      segmentId,
    );
  }

  // Teacher routes

  @Get('teacher/lessons')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  async getTeacherLessons(@Request() req: AuthenticatedRequest) {
    return this.videoLearningService.getTeacherLessons(req.user.id);
  }

  @Post('teacher/lessons')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  async createLesson(
    @Request() req: AuthenticatedRequest,
    @Body() dto: {
      topicId: string;
      title: string;
      description?: string;
      videoUrl: string;
    },
  ) {
    return this.videoLearningService.createLesson(
      req.user.id,
      dto,
    );
  }

  @Post('teacher/lessons/:lessonId/segments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  async createSegment(
    @Request() req: AuthenticatedRequest,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() dto: {
      title: string;
      learningContent?: string;
      startTime: number;
      endTime: number;
      segmentOrder: number;
      passingScore?: number;
    },
  ) {
    return this.videoLearningService.createSegment(
      req.user.id,
      lessonId,
      dto,
    );
  }

  @Patch('teacher/segments/:segmentId/content')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  async updateSegmentContent(
    @Request() req: AuthenticatedRequest,
    @Param('segmentId', ParseUUIDPipe) segmentId: string,
    @Body() dto: { learningContent: string },
  ) {
    return this.videoLearningService.updateSegmentContent(
      req.user.id,
      segmentId,
      dto.learningContent,
    );
  }

  @Patch('teacher/lessons/:lessonId/publish')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  async publishLesson(
    @Request() req: AuthenticatedRequest,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.videoLearningService.publishLesson(
      req.user.id,
      lessonId,
    );
  }
}