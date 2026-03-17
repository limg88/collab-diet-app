import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsBoolean()
  isPurchased?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  totalQty?: number;
}
