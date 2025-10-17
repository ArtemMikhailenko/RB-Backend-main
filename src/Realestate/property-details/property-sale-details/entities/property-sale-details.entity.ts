import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "src/Realestate/property/entities/property.entity";
import { Exclude } from "class-transformer";

@Entity('property_sale_details')
export class PropertySaleDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reference: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column({ type: 'text', nullable: true })
  previousBusiness: string; // previous business conducted on the property

  @Column({ nullable: true })
  totalUnits: number;

  @Column({ nullable: true })
  totalLifts: number;

  @Column({ nullable: true })
  nParking: number; // N* parking, e.g., reserved or shared spaces

  @Column({ nullable: true })
  numberOfParking: number; // total parking slots

  @Column({ nullable: true })
  parkingSize: string; // could be sqft/m² per slot

  @Column({ nullable: true })
  numberOfStorage: number; // total storage units

  @Column({ nullable: true })
  storageSize: string; // size per storage unit

  @Column({ nullable: true })
  classification: string; // e.g., commercial, residential, mixed-use

  @ManyToOne(() => Property, (property) => property.details, { onDelete: 'CASCADE' })
  property: Property;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
