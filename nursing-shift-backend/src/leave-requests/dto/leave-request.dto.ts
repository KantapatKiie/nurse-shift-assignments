import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { LeaveRequestStatus } from '../../entities/leave-request.entity';

export class CreateLeaveRequestDto {
  @IsNumber()
  shift_assignment_id: number;

  @IsNotEmpty()
  reason: string;
}

export class UpdateLeaveRequestDto {
  @IsEnum(LeaveRequestStatus)
  status: LeaveRequestStatus;
}
