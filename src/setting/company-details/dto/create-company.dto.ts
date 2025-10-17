// src/company-details/dto/create-company.dto.ts
import { IsOptional, IsString, IsBoolean, IsArray, IsEmail } from 'class-validator';

export class CreateCompanyDto {
  // BASIC INFO
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  officeUrlName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  // ADDRESS
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  // SIZE & STRUCTURE
  @IsOptional()
  @IsString()
  companySize?: string;

  @IsOptional()
  @IsString()
  yearFounded?: string;

  // COMPANY HISTORY
  @IsOptional()
  @IsString()
  history?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facts?: string[];

  // MEDIA
  @IsOptional()
  @IsString()
  presentationVideo?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  // VISIBILITY SETTINGS
  @IsOptional()
  @IsBoolean()
  showOfficeAddress?: boolean;

  @IsOptional()
  @IsBoolean()
  showPostsInFeed?: boolean;

  @IsOptional()
  @IsBoolean()
  hideFromPartners?: boolean;

  // LANGUAGES
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}
