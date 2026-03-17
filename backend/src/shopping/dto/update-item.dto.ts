import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { UnitEnum } from '../../ingredients/ingredient.entity';

export class UpdateItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999)
  stockQty?: number;

  @IsOptional()
  @IsBoolean()
  isPurchased?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(99999)
  totalQty?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UnitEnum)
  unit?: UnitEnum;

  @IsOptional()
  @IsString()
  category?: string;
}
