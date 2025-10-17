import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Entity('property_media')
export class PropertyMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string; // FK to property

  @Column({ type: 'varchar', nullable: true })
  videoUrl: string | null; // single URL

  @Column({ type: 'varchar', nullable: true })
  virtualTour: string | null; // single URL

  // ✅ Use default as string for MySQL JSON columns
  @Column('simple-array', { nullable: true })
  images: string[]; // array of images

  @Expose()
  get imagesUrl(): string[] | null {
    if (!this.images?.length) return null;
    const host = process.env.APP_BASE_URL || 'http://localhost:3000';
    return this.images.map((img) => `${host}${img}`);
  }

  @Column('simple-array', { nullable: true })
  pdfs: string[]; // array of PDFs;

  @Expose()
  get pdfUrl():string[] | null{
    if(!this.pdfs?.length) return null;
     const host = process.env.APP_BASE_URL || 'http://localhost:3000';
     return this.pdfs.map((pdf)=>`${host}${pdf}`)
  }

  @ManyToOne(() => Property, (property) => property.media, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
