import { IsNumber, Min, Max } from 'class-validator';

export class UpdateMealItemDto {
  @IsNumber()
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  @Max(99999)
  quantity: number;
}
