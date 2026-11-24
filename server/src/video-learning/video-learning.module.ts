
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideoLesson } from './models/video-lesson.entity';
import { VideoSegment } from './models/video-segment.entity';
import { VideoProgress } from './models/video-progress.entity';
import { Topic } from '../content/models/topic.entity';

import { VideoLearningController } from './controllers/video-learning.controller';
import { VideoLearningService } from './services/video-learning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoLesson,
      VideoSegment,
      VideoProgress,
      Topic,
    ]),
  ],
  controllers: [VideoLearningController],
  providers: [VideoLearningService],
  exports: [VideoLearningService],
})
export class VideoLearningModule {}
