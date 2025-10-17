// src/Realestate/property-resale-features/dto/create-property-resale-features.dto.ts
import { IsUUID, IsString, IsNumber, IsOptional,IsArray,IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyResaleFeaturesDto {
  @IsUUID()
@IsUUID()
  propertyId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  internalArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  landArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  numberOfFloor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  totalFloor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearOfConstruction?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  hoa?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  taxes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  commission?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

