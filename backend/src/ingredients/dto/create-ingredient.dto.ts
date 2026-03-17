import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { UnitEnum, MealTypeEnum } from '../ingredient.entity';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(UnitEnum)
  defaultUnit: UnitEnum;

  @IsNumber()
  @Min(0.01)
  @Max(99999)
  defaultQty: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(MealTypeEnum, { each: true })
  allowedMealTypes?: MealTypeEnum[];
}
