import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../utils/user-roles';
import { Notification } from '../../notification/entities/notification.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  @Exclude()
  role: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  @Exclude()
  phone: string;

  @Column({ default: new Date() })
  @Exclude()
  createdAt: Date;

  @Column({ default: new Date() })
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @OneToMany(() => Appointment, (a) => a.owner)
  ownerAppointments: Appointment[];

  @OneToMany(() => Appointment, (a) => a.requester)
  requesterAppointments: Appointment[];
}
