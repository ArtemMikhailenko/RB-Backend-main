// src/Realestate/property-resale-features/entities/property-resale-features.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Property } from 'src/Realestate/property/entities/property.entity';
import { Exclude } from 'class-transformer';

@Entity('property_resale_features')
export class PropertyResaleFeatures {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ Relation with property
  @ManyToOne(() => Property, (property) => property.resaleFeatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Exclude()
  @Column()
  propertyId: string;

  // Resale Features

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  internalArea: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  landArea: number;

  @Column({ type: 'int', nullable: true })
  numberOfFloor: number;

  @Column({ type: 'int', nullable: true })
  totalFloor: number;

  @Column({ type: 'int', nullable: true })
  yearOfConstruction: number;

  @Column({ type: 'int', nullable: true })
  hoa: number;

  @Column({ type: 'int', nullable: true })
  taxes: number;

  @Column({ type: 'int', nullable: true })
  commission: number;

  @Column('simple-array', { nullable: true })
  features: string[];

  // Language and description field

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
