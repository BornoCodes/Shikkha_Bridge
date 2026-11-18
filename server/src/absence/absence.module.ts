import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Absence } from './models/absence.entity';
import { MissedTopic } from './models/missed-topic.entity';
import { AbsenceService } from './services/absence.service';
import { AbsenceController } from './controllers/absence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Absence, MissedTopic])],
  controllers: [AbsenceController],
  providers: [AbsenceService],
  exports: [AbsenceService],
})
export class AbsenceModule {}
