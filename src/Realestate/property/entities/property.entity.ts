// src/property/entities/property.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';
import { PropertyType } from 'src/Realestate/property-type/entities/property-type.entity';
import { PropertyLocation } from 'src/Realestate/property-location/entities/property-location.entity';
import { PropertyMedia } from 'src/Realestate/property-media/entities/property-media.entity';
import { PropertySaleDetails } from 'src/Realestate/property-details/property-sale-details/entities/property-sale-details.entity';
import { NewBuildingDetails } from 'src/Realestate/property-details/property-new-building-details/entities/new-building-detail.entity';
import { PropertyRentDetails } from 'src/Realestate/property-details/property-rent-details/entities/property-rent-details.entity';
import { PropertyNewBuildingFeatures } from '../../property-feature-and-contact/property-new-building-features/entities/property-new-building-features.entity';
import { PropertyResaleFeatures } from '../../property-feature-and-contact/property-resale-features/entities/property-resale-features.entity';
import { RentContact } from 'src/Realestate/property-feature-and-contact/property-rent-contact/entities/rent-contact.entity';

export enum PropertyPurpose {
  SALE = 'sale',
  RENT = 'rent',
}

export enum PropertyPurposeOption {
  NEW = 'new',
  RESALE = 'resale',
  SHORT = 'short',
  LONG = 'long',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PropertyPurpose })
  purpose: PropertyPurpose;

  @Column({ type: 'enum', enum: PropertyPurposeOption })
  purposeOption: PropertyPurposeOption;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.properties, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => PropertyType, (propertyType) => propertyType.property, {
    cascade: true,
    eager: true,
  })
  propertyTypes: PropertyType[];

  @OneToMany(
    () => PropertyLocation,
    (propertyLocation) => propertyLocation.property,
    {
      cascade: true,
      eager: true,
    },
  )
  propertyLocations: PropertyLocation[];

  // ✅ One property can have many media (images, videos, docs, etc.)
  @OneToMany(() => PropertyMedia, (media) => media.property, {
    cascade: true,
    eager: true,
  })
  media: PropertyMedia[];

  @Exclude()
  @OneToMany(
    () => PropertySaleDetails,
    (propertySale) => propertySale.property,
    { cascade: true, eager: true },
  )
  propertySaleDetails: PropertySaleDetails[];

  @Exclude()
  @OneToMany(() => NewBuildingDetails, (newBuilding) => newBuilding.property, {
    cascade: true,
    eager: true,
  })
  newBuildingDetails: NewBuildingDetails[];

  @Exclude()
  @OneToMany(() => PropertyRentDetails, (rentDetails) => rentDetails.property, {
    cascade: true,
    eager: true,
  })
  propertyRentDetails: PropertyRentDetails[];

  // 👉 Virtual field for frontend

  @Expose()
  get details() {
    switch (this.purposeOption) {
      case PropertyPurposeOption.NEW:
        return this.newBuildingDetails?.length > 0
          ? this.newBuildingDetails
          : undefined;

      case PropertyPurposeOption.RESALE:
        return this.propertySaleDetails?.length > 0
          ? this.propertySaleDetails
          : undefined;

      case PropertyPurposeOption.SHORT:
      case PropertyPurposeOption.LONG:
        return this.propertyRentDetails?.length > 0
          ? this.propertyRentDetails
          : undefined;

      default:
        return undefined;
    }
  }

  @Exclude()
  @OneToMany(
    () => PropertyNewBuildingFeatures,
    (features) => features.property,
    { cascade: true, eager: true },
  )
  newBuildingFeatures: PropertyNewBuildingFeatures[];

  @Exclude()
  @OneToMany(() => PropertyResaleFeatures, (features) => features.property, {
    cascade: true,
    eager: true,
  })
  resaleFeatures: PropertyResaleFeatures[];

  @Exclude()
  @OneToMany(() => RentContact, (rentContact) => rentContact.property, {
    cascade: true,
    eager:true,
  })
  rentContacts: RentContact[];
  
    // 👉 Virtual field for frontend
  @Expose()
  get features() {
    switch (this.purposeOption) {
      case PropertyPurposeOption.NEW:
        return this.newBuildingFeatures?.length > 0
          ? this.newBuildingFeatures
          : undefined;

      case PropertyPurposeOption.RESALE:
        return this.resaleFeatures?.length > 0
          ? this.resaleFeatures
          : undefined;

      case PropertyPurposeOption.SHORT:
      case PropertyPurposeOption.LONG:
        return this.rentContacts?.length > 0
          ? this.rentContacts
          : undefined;

      default:
        return undefined;
    }
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
