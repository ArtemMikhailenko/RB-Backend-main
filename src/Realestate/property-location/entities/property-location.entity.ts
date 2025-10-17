import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Entity()
export class PropertyLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  floor: string;

  @Column({ nullable: true })
  door: string;

  @Column()
  zipcode: string;

  @Column()
  city: string;

  @Column({ type: 'decimal', nullable: true })
  latitude: number;

  @Column({ type: 'decimal', nullable: true })
  longitude: number;

  @Column({ default: true })
  showExactLocation: boolean;

  @ManyToOne(() => Property, (property) => property.propertyLocations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
