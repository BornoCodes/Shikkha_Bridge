
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Assessment } from './models/assessment.entity';
import { AssessmentQuestion } from './models/assessment-question.entity';
import { Topic } from '../content/models/topic.entity';

import { AssessmentService } from './services/assessment.service';
import { AssessmentController } from './controllers/assessment.controller';

import { VideoLearningModule } from '../video-learning/video-learning.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      AssessmentQuestion,
      Topic,
    ]),
    VideoLearningModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
