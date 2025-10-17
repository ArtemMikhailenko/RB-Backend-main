import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Entity('property_new_building_features')
export class PropertyNewBuildingFeatures {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['Residential', 'Commercial'], nullable: true })
  typeOfComplex?: string;

  @Column({ type: 'int', nullable: true })
  totalUnits: number;

  @Column({ type: 'int', nullable: true })
  blockNumber: number;

  @Column({ type: 'int', nullable: true })
  forSale: number;

  @Column({ type: 'int', nullable: true })
  yearOfConstruction: number;

  @Column({ type: 'text', nullable: true })
  promotion: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  hoa: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  taxes: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  commission: number;

  // ✅ Flattened "Available list"
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  priceFrom: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  priceTo: number;

  @Column({ type: 'int', nullable: true })
  bedroom: number;

  @Column({ type: 'int', nullable: true })
  bathroom: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  internalArea: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  landArea: number;

  @Column({ type: 'int', nullable: true })
  floor: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column('simple-array', { nullable: true })
  features: string[];

  // ✅ New fields
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  // ✅ Many-to-One relation like `NewBuildingDetails`
  @ManyToOne(() => Property, (property) => property.newBuildingFeatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
