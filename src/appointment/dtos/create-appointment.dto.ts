// src/appointments/dtos/create-appointment.dto.ts
import { IsNotEmpty, IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2025-07-01T14:30:00Z' })
  @IsNotEmpty()
  @IsDateString()
  dateTime: Date;

  @ApiProperty({ example: '123 El Sudan Street, Giza, Egypt' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  requesterId: number;
}
