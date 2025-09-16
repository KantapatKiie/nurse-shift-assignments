import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift, ShiftAssignment, User } from '../entities';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, ShiftAssignment, User])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule {}
