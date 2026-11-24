import { IsOptional, IsString, IsEnum, IsUrl } from 'class-validator';
import { UserRole } from '../models/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  class?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
