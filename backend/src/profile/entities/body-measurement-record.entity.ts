import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('body_measurement_records')
export class BodyMeasurementRecord {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) collo: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) spalle: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) petto: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) braccioL: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) braccioR: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) vita: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) fianchi: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) cosciaL: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) cosciaR: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) polpaccioL: number;
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) polpaccioR: number;

  @CreateDateColumn() recordedAt: Date;
}
