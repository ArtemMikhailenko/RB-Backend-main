// src/Realestate/rent-contact/entities/rent-contact.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from 'src/Realestate/property/entities/property.entity';
import { Exclude } from 'class-transformer';

export enum ContactPreference {
  PHONE_AND_CHAT = 'PHONE_AND_CHAT',
  CHAT_ONLY = 'CHAT_ONLY',
  CHAT_WITH_PROFILE = 'CHAT_WITH_PROFILE',
  PHONE_ONLY = 'PHONE_ONLY',
}

@Entity('rent_contact')
export class RentContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  countryCode1: string;

  @Column({ nullable: true })
  phone1: string;

  @Column({ nullable: true })
  countryCode2: string;

  @Column({ nullable: true })
  phone2: string;

  @Column({
    type: 'enum',
    enum: ContactPreference,
    default: ContactPreference.PHONE_AND_CHAT,
  })
  contactPreference: ContactPreference;

  // ✅ Link RentContact to Property (ownership comes from property.user)
  @ManyToOne(() => Property, (property) => property.rentContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;
  
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
