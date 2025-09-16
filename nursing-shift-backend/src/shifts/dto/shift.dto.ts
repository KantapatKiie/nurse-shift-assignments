import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateShiftDto {
  @IsDateString()
  date: string;

  @IsNotEmpty()
  start_time: string; // Format: HH:MM

  @IsNotEmpty()
  end_time: string; // Format: HH:MM
}

export class AssignShiftDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  shift_id: number;
}
