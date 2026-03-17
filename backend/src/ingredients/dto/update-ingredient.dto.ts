import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { UnitEnum, MealTypeEnum } from '../ingredient.entity';

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(UnitEnum)
  defaultUnit?: UnitEnum;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(99999)
  defaultQty?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(MealTypeEnum, { each: true })
  allowedMealTypes?: MealTypeEnum[];
}
