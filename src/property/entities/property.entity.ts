import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyPostingTypes, PropertyTypes } from '../utils/property-posting-types';
import { PropertyImage } from './property-image.entity';

@Entity({ name: 'properties' })
export class Property {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: PropertyTypes, nullable: true })
  type: string;

  @Column({ type: 'enum', enum: PropertyPostingTypes, nullable: true })
  postingType: string;

  @Column()
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ type: 'text', array: true, nullable: true })
  features: string[];

  @Column()
  price: number;

  @Column()
  area: number;

  @Column()
  beds: number;

  @Column()
  baths: number;

  @OneToMany(() => PropertyImage, (image) => image.property, { cascade: true })
  images: PropertyImage[];

  @Exclude()
  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: null })
  updatedAt: Date;
}
