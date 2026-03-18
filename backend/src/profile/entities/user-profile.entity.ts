import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/user.entity';

export enum Gender {
  M = 'M',
  F = 'F',
  OTHER = 'OTHER',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true }) firstName: string;
  @Column({ nullable: true }) lastName: string;

  @Column({ type: 'date', nullable: true }) birthDate: string;

  @Column({ type: 'enum', enum: Gender, nullable: true }) gender: Gender;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) heightCm: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
