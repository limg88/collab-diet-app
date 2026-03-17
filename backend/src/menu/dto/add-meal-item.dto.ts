import { IsEnum, IsInt, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { MealTypeEnum, UnitEnum } from '../../ingredients/ingredient.entity';

export class AddMealItemDto {
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek: number;

  @IsEnum(MealTypeEnum)
  mealType: MealTypeEnum;

  @IsString()
  ingredientId: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  quantity?: number;

  @IsOptional()
  @IsEnum(UnitEnum)
  unit?: UnitEnum;
}
