import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoveryPlan } from './models/recovery-plan.entity';
import { RecoveryPlanItem } from './models/recovery-plan-item.entity';
import { RecoveryService } from './services/recovery.service';
import { RecoveryController } from './controllers/recovery.controller';
import { AbsenceModule } from '../absence/absence.module';
import { AssessmentModule } from '../assessment/assessment.module';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecoveryPlan, RecoveryPlanItem]),
    AbsenceModule,
    AssessmentModule,
    ContentModule,
  ],
  controllers: [RecoveryController],
  providers: [RecoveryService],
  exports: [RecoveryService],
})
export class RecoveryModule {}
