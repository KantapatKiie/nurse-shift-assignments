import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('shifts')
@Unique(['date', 'start_time', 'end_time'])
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  date: string;

  @Column({ type: 'text' })
  start_time: string;

  @Column({ type: 'text' })
  end_time: string;

  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.createdShifts)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany('ShiftAssignment', 'shift')
  shiftAssignments: any[];
}
