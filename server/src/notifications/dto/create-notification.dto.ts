import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { NotificationType } from '../models/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  metadata?: any;
}
