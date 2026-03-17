import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { UnitEnum } from '../../ingredients/ingredient.entity';

export class CreateExtraItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(UnitEnum)
  unit: UnitEnum;

  @IsNumber()
  @Min(0.01)
  totalQty: number;
}
