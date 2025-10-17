import { IsNotEmpty, IsNumber, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreatePropertySaleDetailsDto {
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsUUID()
  propertyId: string; // link to Property entity

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsString()
  previousBusiness?: string;

  @IsOptional()
  @IsNumber()
  totalUnits?: number;

  @IsOptional()
  @IsNumber()
  totalLifts?: number;

  @IsOptional()
  @IsNumber()
  nParking?: number; // N* parking

  @IsOptional()
  @IsNumber()
  numberOfParking?: number;

  @IsOptional()
  @IsString()
  parkingSize?: string; // per parking slot

  @IsOptional()
  @IsNumber()
  numberOfStorage?: number;

  @IsOptional()
  @IsString()
  storageSize?: string; // per storage unit

  @IsOptional()
  @IsString()
  classification?: string; // e.g., commercial, residential
}
