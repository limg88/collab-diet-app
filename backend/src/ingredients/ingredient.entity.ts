import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum UnitEnum {
  GR = 'gr',
  ML = 'ml',
  UNIT = 'unit',
}

export enum MealTypeEnum {
  BREAKFAST = 'BREAKFAST',
  MORNING_SNACK = 'MORNING_SNACK',
  LUNCH = 'LUNCH',
  AFTERNOON_SNACK = 'AFTERNOON_SNACK',
  DINNER = 'DINNER',
  NIGHT_SNACK = 'NIGHT_SNACK',
}

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  category: string | null;

  @Column({ type: 'enum', enum: UnitEnum, default: UnitEnum.GR })
  defaultUnit: UnitEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  defaultQty: number;

  @Column({ type: 'simple-array', nullable: true })
  allowedMealTypes: string[] | null;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
