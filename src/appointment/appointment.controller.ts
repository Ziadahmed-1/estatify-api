import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { AppointmentService } from './appointment.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get()
  getAllAppointments() {
    return this.appointmentService.getAllAppointments();
  }

  @Get(':id')
  getAppointment(@Param('id') id: number) {
    return this.appointmentService.getAppointment(id);
  }

  @Post('/:id/confirm')
  confirmAppointment(@Param('id') id: number, @CurrentUser() user: { userId: number }) {
    return this.appointmentService.confirmAppointment(id, user);
  }

  @Post('/:id/reject')
  rejectAppointment(@Param('id') id: number, @CurrentUser() user: { userId: number }) {
    return this.appointmentService.rejectAppointment(id, user);
  }

  @Post('/:id/cancel')
  cancelAppointment(@Param('id') id: number, @CurrentUser() user: { userId: number }) {
    return this.appointmentService.cancelAppointment(id, user);
  }
}
