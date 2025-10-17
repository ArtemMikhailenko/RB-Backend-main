// src/Realestate/rent-contact/dto/create-rent-contact.dto.ts
import { IsEnum, IsOptional, IsString, MaxLength, IsUUID, IsNumber } from 'class-validator';
import { ContactPreference } from '../entities/rent-contact.entity';

export class CreateRentContactDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  countryCode1?: string;

  @IsOptional()
  @IsString()
  phone1?: string;

  @IsOptional()
  @IsString()
  countryCode2?: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsEnum(ContactPreference)
  contactPreference: ContactPreference;

  @IsUUID()
  propertyId: string; // ✅ ownership check uses this
}
