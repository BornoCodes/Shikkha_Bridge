import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { PlanStatus } from '../models/recovery-plan.entity';

export class ApprovePlanDto {
  @IsNotEmpty()
  @IsEnum([PlanStatus.APPROVED, PlanStatus.REJECTED, PlanStatus.IN_PROGRESS])
  status: PlanStatus;

  @IsOptional()
  @IsString()
  teacherNotes?: string;
}
