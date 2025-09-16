import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift, ShiftAssignment, User, UserRole } from '../entities';
import { CreateShiftDto, AssignShiftDto } from './dto/shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(ShiftAssignment)
    private shiftAssignmentRepository: Repository<ShiftAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createShift(createShiftDto: CreateShiftDto, createdBy: number) {
    const { date, start_time, end_time } = createShiftDto;

    // Validate that end_time is after start_time
    if (start_time >= end_time) {
      throw new BadRequestException('End time must be after start time');
    }

    const shift = this.shiftRepository.create({
      date,
      start_time,
      end_time,
      created_by: createdBy,
    });

    return await this.shiftRepository.save(shift);
  }

  async assignShift(assignShiftDto: AssignShiftDto, assignedBy: number) {
    const { user_id, shift_id } = assignShiftDto;

    // Check if user exists and is a nurse
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user || user.role !== UserRole.NURSE) {
      throw new NotFoundException('Nurse not found');
    }

    // Check if shift exists
    const shift = await this.shiftRepository.findOne({ where: { id: shift_id } });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    // Check if assignment already exists
    const existingAssignment = await this.shiftAssignmentRepository.findOne({
      where: { user_id, shift_id },
    });
    if (existingAssignment) {
      throw new BadRequestException('User is already assigned to this shift');
    }

    const assignment = this.shiftAssignmentRepository.create({
      user_id,
      shift_id,
      assigned_by: assignedBy,
    });

    return await this.shiftAssignmentRepository.save(assignment);
  }

  async getMySchedule(userId: number) {
    const assignments = await this.shiftAssignmentRepository.find({
      where: { user_id: userId },
      relations: ['shift'],
      order: { shift: { date: 'ASC', start_time: 'ASC' } },
    });

    return assignments.map(assignment => ({
      id: assignment.id,
      date: assignment.shift.date,
      start_time: assignment.shift.start_time,
      end_time: assignment.shift.end_time,
      shift_id: assignment.shift_id,
    }));
  }

  async getAllShifts() {
    return await this.shiftRepository.find({
      relations: ['createdBy'],
      order: { date: 'ASC', start_time: 'ASC' },
    });
  }

  async getShiftAssignments(shiftId: number) {
    return await this.shiftAssignmentRepository.find({
      where: { shift_id: shiftId },
      relations: ['user', 'shift'],
    });
  }

  async joinShift(shiftId: number, userId: number) {
    // Check if shift exists
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    // Check if user is already assigned to this shift
    const existingAssignment = await this.shiftAssignmentRepository.findOne({
      where: { shift_id: shiftId, user_id: userId },
    });

    if (existingAssignment) {
      throw new ConflictException('You are already assigned to this shift');
    }

    // Create assignment with self-assignment (assigned_by = userId)
    const assignment = this.shiftAssignmentRepository.create({
      user_id: userId,
      shift_id: shiftId,
      assigned_by: userId,
    });

    return await this.shiftAssignmentRepository.save(assignment);
  }
}
