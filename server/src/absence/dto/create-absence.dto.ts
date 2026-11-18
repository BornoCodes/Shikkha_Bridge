import { IsNotEmpty, IsEnum, IsArray, IsOptional, IsString, IsDateString } from 'class-validator';
import { AbsenceReason } from '../models/absence.entity';

export class CreateAbsenceDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsEnum(AbsenceReason)
  reason: AbsenceReason;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicIds?: string[];
}
