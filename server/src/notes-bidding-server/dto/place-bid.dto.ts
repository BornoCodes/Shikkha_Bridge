import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';

export class PlaceBidDto {
  @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive()
  price: number;

  @IsInt() @IsPositive() @Max(365)
  deliveryDays: number;

  @IsString() @IsNotEmpty() @MaxLength(500)
  pitch: string;

  @IsString() @IsNotEmpty()
  samplePage: string;
}

// For "Edit Bid": every field is optional
export class UpdateBidDto {
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive()
  price?: number;

  @IsOptional() @IsInt() @IsPositive() @Max(365)
  deliveryDays?: number;

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(500)
  pitch?: string;

  @IsOptional() @IsString() @IsNotEmpty()
  samplePage?: string;
}
