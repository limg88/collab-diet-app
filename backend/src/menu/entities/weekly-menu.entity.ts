import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { MenuDay } from './menu-day.entity';

@Entity('weekly_menus')
export class WeeklyMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  weekStart: string;

  @OneToMany(() => MenuDay, (day) => day.menu, { cascade: true, eager: false })
  days: MenuDay[];

  @CreateDateColumn()
  createdAt: Date;
}
