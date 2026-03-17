import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MenuDay } from './menu-day.entity';
import { MealItem } from './meal-item.entity';
import { MealTypeEnum } from '../../ingredients/ingredient.entity';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dayId: string;

  @ManyToOne(() => MenuDay, (day) => day.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dayId' })
  day: MenuDay;

  @Column({ type: 'enum', enum: MealTypeEnum })
  mealType: MealTypeEnum;

  @OneToMany(() => MealItem, (item) => item.meal, { cascade: true, eager: false })
  items: MealItem[];
}
