import { IsNotEmpty, IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class GenerateAssessmentDto {
  @IsNotEmpty()
  @IsString()
  topicId: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  questionCount?: number;
}
