import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne } from 'typeorm';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Entity('property_types')
export class PropertyType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyType: string; // from grid

  @Column({ nullable: true })
  category: string; // text input from frontend

  @Column("simple-array", { nullable: true })
  tags: string[]; // array of tags

    @ManyToOne(() => Property, (property) => property.propertyTypes, { onDelete: 'CASCADE' })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
