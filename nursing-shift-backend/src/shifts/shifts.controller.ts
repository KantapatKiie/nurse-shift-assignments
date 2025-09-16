import { Controller, Post, Get, Body, UseGuards, Request, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto, AssignShiftDto } from './dto/shift.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { UserRole } from '../entities/user.entity';

@Controller('shifts')
@UseGuards(AuthGuard('jwt'))
export class ShiftsController {
  constructor(private shiftsService: ShiftsService) {}

  @Post()
  @Roles(UserRole.HEAD_NURSE)
  @UseGuards(RoleGuard)
  async createShift(@Body(ValidationPipe) createShiftDto: CreateShiftDto, @Request() req) {
    return this.shiftsService.createShift(createShiftDto, req.user.userId);
  }

  @Post('assign')
  @Roles(UserRole.HEAD_NURSE)
  @UseGuards(RoleGuard)
  async assignShift(@Body(ValidationPipe) assignShiftDto: AssignShiftDto, @Request() req) {
    return this.shiftsService.assignShift(assignShiftDto, req.user.userId);
  }

  @Post('join')
  @Roles(UserRole.NURSE)
  @UseGuards(RoleGuard)
  async joinShift(@Body() joinShiftDto: { shiftId: number }, @Request() req) {
    return this.shiftsService.joinShift(joinShiftDto.shiftId, req.user.userId);
  }

  @Get('my-schedule')
  @Roles(UserRole.NURSE)
  @UseGuards(RoleGuard)
  async getMySchedule(@Request() req) {
    return this.shiftsService.getMySchedule(req.user.userId);
  }

  @Get(':id/assignments')
  @Roles(UserRole.HEAD_NURSE)
  @UseGuards(RoleGuard)
  async getShiftAssignments(@Param('id') shiftId: number) {
    return this.shiftsService.getShiftAssignments(shiftId);
  }

  @Get()
  @Roles(UserRole.HEAD_NURSE)
  @UseGuards(RoleGuard)
  async getAllShifts() {
    return this.shiftsService.getAllShifts();
  }
}
