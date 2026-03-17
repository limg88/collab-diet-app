import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { WeeklyMenu } from './weekly-menu.entity';
import { Meal } from './meal.entity';

@Entity('menu_days')
export class MenuDay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  menuId: string;

  @ManyToOne(() => WeeklyMenu, (menu) => menu.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: WeeklyMenu;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @OneToMany(() => Meal, (meal) => meal.day, { cascade: true, eager: false })
  meals: Meal[];
}
