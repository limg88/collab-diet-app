import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { UnitEnum } from '../ingredients/ingredient.entity';

export enum ShoppingSourceEnum {
  MENU = 'MENU',
  FUORI_MENU = 'FUORI_MENU',
}

export interface CollaboratorBreakdownEntry {
  userId: string;
  email: string;
  qty: number;
}

@Entity('shopping_items')
export class ShoppingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  weekStart: string;

  @Column({ type: 'enum', enum: ShoppingSourceEnum })
  source: ShoppingSourceEnum;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  category: string | null;

  @Column({ type: 'enum', enum: UnitEnum })
  unit: UnitEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalQty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockQty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  collaboratorStockQty: number;

  @Column({ nullable: true, type: 'varchar' })
  mealType: string | null;

  @Column({ default: false })
  isPurchased: boolean;

  @Column({ type: 'json', nullable: true })
  collaboratorBreakdown: CollaboratorBreakdownEntry[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
