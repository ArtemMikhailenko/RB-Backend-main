import { Entity,PrimaryGeneratedColumn,Column,ManyToOne ,CreateDateColumn,UpdateDateColumn } from "typeorm";
import { Property } from "src/Realestate/property/entities/property.entity";
import { Exclude } from "class-transformer";


@Entity('property_rent_details')
export class PropertyRentDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  persons: number;

  @Column({ type: 'int', nullable: true })
  bedrooms: number;

  @Column({ type: 'int', nullable: true })
  beds: number;

  @Column({ type: 'int', nullable: true })
  bathrooms: number;

  @Column({ type: 'int', nullable: true })
  floors: number;

  @Column({ type: 'varchar', nullable: true })
  builtArea?: string;

  @Column({ type: 'varchar', nullable: true })
  usableArea?: string;

  @Column({ type: 'varchar', nullable: true })
  plotArea?: string;

  @Column("simple-array", { nullable: true })
  features: string[];

  @Column("simple-array", { nullable: true })
  orientation: string[];

  @Column("simple-array", { nullable: true })
  houseFeatures: string[];

  @Column("simple-array", { nullable: true })
  buildingFeatures: string[];

  @Column({ default: true })
  childrenAllowed: boolean;

  @Column({ type: 'boolean', nullable: true })
  petsAllowed: boolean;

  @Column({ default: false })
  disabledAccess: boolean;

  @Column({ default: false })
  disabledInterior: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyRent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  deposit: number;

  @Column({ type: 'text', nullable: true })
  descriptionEs: string;

  @ManyToOne(() => Property, (property) => property.propertyRentDetails, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
