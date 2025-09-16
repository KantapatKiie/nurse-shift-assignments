import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto, UpdateLeaveRequestDto } from './dto/leave-request.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { UserRole } from '../entities/user.entity';

@Controller('leave-requests')
@UseGuards(AuthGuard('jwt'))
export class LeaveRequestsController {
  constructor(private leaveRequestsService: LeaveRequestsService) {}

  @Post()
  @Roles(UserRole.NURSE)
  @UseGuards(RoleGuard)
  async createLeaveRequest(@Body(ValidationPipe) createLeaveRequestDto: CreateLeaveRequestDto, @Request() req) {
    return this.leaveRequestsService.createLeaveRequest(createLeaveRequestDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.HEAD_NURSE)
  @UseGuards(RoleGuard)
  async getAllLeaveRequests() {
    return this.leaveRequestsService.getAllLeaveRequests();
  }

  @Get('my-requests')
  @Roles(UserRole.NURSE)
  @UseGuards(RoleGuard)
  async getMyLeaveRequests(@Request() req) {
    return this.leaveRequestsService.getMyLeaveRequests(req.user.userId);
  }

  @Patch(':id/approve')
  @Roles(UserRole.HEAD_NURSE)
  @UseGuards(RoleGuard)
  async updateLeaveRequest(
    @Param('id') id: string,
    @Body(ValidationPipe) updateLeaveRequestDto: UpdateLeaveRequestDto,
    @Request() req
  ) {
    return this.leaveRequestsService.updateLeaveRequest(+id, updateLeaveRequestDto, req.user.userId);
  }
}
