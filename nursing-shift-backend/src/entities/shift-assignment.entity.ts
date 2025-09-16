import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Shift } from './shift.entity';

@Entity('shift_assignments')
@Unique(['user_id', 'shift_id'])
export class ShiftAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  shift_id: number;

  @Column()
  assigned_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.shiftAssignments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Shift, shift => shift.shiftAssignments)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @ManyToOne(() => User, user => user.assignedShifts)
  @JoinColumn({ name: 'assigned_by' })
  assignedBy: User;

  @OneToMany('LeaveRequest', 'shiftAssignment')
  leaveRequests: any[];
}
