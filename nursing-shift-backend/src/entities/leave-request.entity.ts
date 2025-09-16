import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftAssignment } from './shift-assignment.entity';
import { User } from './user.entity';

export enum LeaveRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shift_assignment_id: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: LeaveRequestStatus.PENDING,
  })
  status: LeaveRequestStatus;

  @Column({ nullable: true })
  approved_by: number;

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => ShiftAssignment, shiftAssignment => shiftAssignment.leaveRequests)
  @JoinColumn({ name: 'shift_assignment_id' })
  shiftAssignment: ShiftAssignment;

  @ManyToOne(() => User, user => user.approvedLeaveRequests, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User;
}
