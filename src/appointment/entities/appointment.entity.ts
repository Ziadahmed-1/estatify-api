import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Property } from '../../property/entities/property.entity';
import { User } from 'src/user/entities/user.entity';
import { AppointmentStatus } from '../utils/appointment-status';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  dateTime: Date;

  @Column()
  location: string;

  // Just store IDs (TypeORM does this under the hood with ManyToOne)
  @ManyToOne(() => Property, { eager: false })
  property: Property;

  @ManyToOne(() => User, { eager: false })
  owner: User;

  @ManyToOne(() => User, { eager: false })
  requester: User;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;
}
