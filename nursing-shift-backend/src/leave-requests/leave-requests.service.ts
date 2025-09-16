import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveRequestStatus, ShiftAssignment, UserRole } from '../entities';
import { CreateLeaveRequestDto, UpdateLeaveRequestDto } from './dto/leave-request.dto';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(ShiftAssignment)
    private shiftAssignmentRepository: Repository<ShiftAssignment>,
  ) {}

  async createLeaveRequest(createLeaveRequestDto: CreateLeaveRequestDto, userId: number) {
    const { shift_assignment_id, reason } = createLeaveRequestDto;

    // Check if shift assignment exists and belongs to the user
    const shiftAssignment = await this.shiftAssignmentRepository.findOne({
      where: { id: shift_assignment_id },
      relations: ['user', 'shift'],
    });

    if (!shiftAssignment) {
      throw new NotFoundException('Shift assignment not found');
    }

    if (shiftAssignment.user_id !== userId) {
      throw new ForbiddenException('You can only request leave for your own shifts');
    }

    // Check if there's already a pending leave request for this assignment
    const existingRequest = await this.leaveRequestRepository.findOne({
      where: { 
        shift_assignment_id,
        status: LeaveRequestStatus.PENDING 
      },
    });

    if (existingRequest) {
      throw new BadRequestException('There is already a pending leave request for this shift');
    }

    const leaveRequest = this.leaveRequestRepository.create({
      shift_assignment_id,
      reason,
      status: LeaveRequestStatus.PENDING,
    });

    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async getAllLeaveRequests() {
    return await this.leaveRequestRepository.find({
      relations: ['shiftAssignment', 'shiftAssignment.user', 'shiftAssignment.shift', 'approvedBy'],
      order: { created_at: 'DESC' },
    });
  }

  async updateLeaveRequest(id: number, updateLeaveRequestDto: UpdateLeaveRequestDto, approvedBy: number) {
    const { status } = updateLeaveRequestDto;

    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['shiftAssignment', 'shiftAssignment.user', 'shiftAssignment.shift'],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be updated');
    }

    leaveRequest.status = status;
    leaveRequest.approved_by = approvedBy;
    leaveRequest.approved_at = new Date();

    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async getMyLeaveRequests(userId: number) {
    return await this.leaveRequestRepository.find({
      where: { shiftAssignment: { user_id: userId } },
      relations: ['shiftAssignment', 'shiftAssignment.shift', 'approvedBy'],
      order: { created_at: 'DESC' },
    });
  }
}
