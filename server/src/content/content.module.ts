import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './models/content.entity';
import { Subject } from './models/subject.entity';
import { Topic } from './models/topic.entity';
import { ContentService } from './services/content.service';
import { ContentController } from './controllers/content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Subject, Topic])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService, TypeOrmModule],
})
export class ContentModule {}
