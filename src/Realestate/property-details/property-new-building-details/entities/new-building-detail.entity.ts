import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../../../property/entities/property.entity';

@Entity('new_building_details')
export class NewBuildingDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  reference: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'date', name: 'delivery_date' })
  deliveryDate: Date;

  @Column({ type: 'varchar', length: 100 })
  stage: string;

  @ManyToOne(() => Property, (property) => property.newBuildingDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
