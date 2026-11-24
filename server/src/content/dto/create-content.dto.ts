import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ContentType } from '../models/content.entity';

export class CreateContentDto {
  @IsNotEmpty()
  @IsUUID()
  topicId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(ContentType)
  type!: ContentType;

  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;
}