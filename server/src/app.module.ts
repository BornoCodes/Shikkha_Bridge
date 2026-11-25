
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContentModule } from './content/content.module';
import { AssessmentModule } from './assessment/assessment.module';
import { VideoLearningModule } from './video-learning/video-learning.module';
import { NotesBiddingModule } from './notes-bidding-server/notes-bidding.module';

import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    AuthModule,
    UsersModule,
    ContentModule,
    AssessmentModule,
    VideoLearningModule,
    NotesBiddingModule,
  ],
})
export class AppModule {}
