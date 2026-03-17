import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Meal } from './meal.entity';
import { Ingredient, UnitEnum } from '../../ingredients/ingredient.entity';

@Entity('meal_items')
export class MealItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mealId: string;

  @ManyToOne(() => Meal, (meal) => meal.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mealId' })
  meal: Meal;

  @Column()
  ingredientId: string;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'enum', enum: UnitEnum })
  unit: UnitEnum;
}
