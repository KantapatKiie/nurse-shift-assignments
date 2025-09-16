import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
  NURSE = 'nurse',
  HEAD_NURSE = 'head_nurse',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.NURSE,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany('ShiftAssignment', 'user')
  shiftAssignments: any[];

  @OneToMany('Shift', 'createdBy')
  createdShifts: any[];

  @OneToMany('ShiftAssignment', 'assignedBy')
  assignedShifts: any[];

  @OneToMany('LeaveRequest', 'approvedBy')
  approvedLeaveRequests: any[];
}
