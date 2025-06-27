import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class PropertyImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bytea' })
  data: Buffer;

  @ManyToOne(() => Property, (property) => property.images, { onDelete: 'CASCADE' })
  property: Property;
}
