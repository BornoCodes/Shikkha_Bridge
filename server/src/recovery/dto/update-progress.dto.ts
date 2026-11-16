import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class UpdateProgressDto {
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;
}
