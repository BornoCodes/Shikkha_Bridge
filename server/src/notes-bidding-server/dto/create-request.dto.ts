import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRequestDto {
  @IsString() @IsNotEmpty() @MaxLength(200)
  topic!: string;

  @IsOptional() @IsString()
  description?: string;
}

