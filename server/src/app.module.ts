import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AbsenceModule } from './absence/absence.module';
import { AssessmentModule } from './assessment/assessment.module';
import { RecoveryModule } from './recovery/recovery.module';
import { ContentModule } from './content/content.module';
import { NotificationsModule } from './notifications/notifications.module';
import { VideoLearningModule } from './video-learning/video-learning.module';
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
    AbsenceModule,
    AssessmentModule,
    RecoveryModule,
    ContentModule,
    NotificationsModule,
    VideoLearningModule,
  ],
})
export class AppModule {}
