import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreatePropertyNewBuildingFeaturesDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  typeOfComplex: string;

  @IsNumber()
  totalUnits: number;

  @IsNumber()
  blockNumber: number;

  @IsNumber()
  forSale: number;

  @IsNumber()
  yearOfConstruction: number;

  @IsString()
  @IsOptional()
  promotion?: string;

  @IsNumber()
  hoa: number;

  @IsNumber()
  taxes: number;

  @IsNumber()
  commission: number;

  @IsNumber()
  priceFrom: number;

  @IsNumber()
  priceTo: number;

  @IsNumber()
  bedroom: number;

  @IsNumber()
  bathroom: number;

  @IsNumber()
  internalArea: number;

  @IsOptional()
  @IsNumber()
  landArea: number;

  @IsOptional()
  @IsNumber()
  floor: number;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  // ✅ New fields
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  language?: string;
}
