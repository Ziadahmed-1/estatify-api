import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Property } from 'src/property/entities/property.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { AppointmentStatus } from 'src/appointment/utils/appointment-status';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly notificationService: NotificationService,

    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    try {
      // Optional: validate that property and users exist
      const property = await this.propertyRepo.findOneBy({ id: dto.propertyId });
      if (!property) throw new NotFoundException('Property not found');

      const owner = await this.userRepo.findOneBy({ id: dto.ownerId });
      const requester = await this.userRepo.findOneBy({ id: dto.requesterId });
      if (!owner || !requester) throw new NotFoundException('Owner or requester not found');

      if (owner.id !== property.userId) throw new NotFoundException('Owner and property do not match');

      const appointment = this.appointmentRepo.create({
        dateTime: dto.dateTime,
        location: dto.location,
        property,
        owner,
        requester,
      });

      const saved = await this.appointmentRepo.save(appointment);

      await this.notificationService.create(requester.id, 'Your appointment has been created.', 'New Appointment');
      await this.notificationService.create(owner.id, 'You have a new appointment.', 'New Appointment');

      return saved;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message || 'Could not create appointment');
    }
  }

  async getAppointment(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['property', 'owner', 'requester'],
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      relations: ['property', 'owner', 'requester'],
      order: { dateTime: 'DESC' },
    });
  }

  async confirmAppointment(id: number, user: { userId: number }): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (appointment.owner.id !== user.userId) throw new ForbiddenException('You are not the owner of this property');

    appointment.status = AppointmentStatus.CONFIRMED;
    const saved = await this.appointmentRepo.save(appointment);

    await this.notificationService.create(
      appointment.requester.id,
      'Your appointment request has been confirmed.',
      'Appointment Confirmed',
    );

    return saved;
  }

  async rejectAppointment(id: number, user: { userId: number }): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (appointment.owner.id !== user.userId) throw new ForbiddenException('You are not the owner of this property');

    appointment.status = AppointmentStatus.REJECTED;
    const saved = await this.appointmentRepo.save(appointment);

    await this.notificationService.create(
      appointment.requester.id,
      'Your appointment request has been rejected.',
      'Appointment Rejected',
    );

    return saved;
  }

  async cancelAppointment(id: number, user: { userId: number }): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (appointment.requester.id !== user.userId)
      throw new ForbiddenException('You are not the requester of this appointment');
    appointment.status = AppointmentStatus.CANCELLED;
    const saved = await this.appointmentRepo.save(appointment);

    await this.notificationService.create(
      appointment.owner.id,
      'Your appointment request has been cancelled.',
      'Appointment Cancelled',
    );

    return saved;
  }
}
