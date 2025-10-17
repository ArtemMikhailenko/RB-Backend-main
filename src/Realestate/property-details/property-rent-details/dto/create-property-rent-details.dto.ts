import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreatePropertyRentDetailsDto {
  @IsUUID()
  propertyId: string; // link to Property entity

  @IsNumber()
  @IsOptional()
  persons?: number;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  beds?: number;

  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  floors?: number;

  @IsString()
  @IsOptional()
  builtArea?: string;

  @IsString()
  @IsOptional()
  usableArea?: string;

  @IsString()
  @IsOptional()
  plotArea?: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsOptional()
  orientation?: string[];

  @IsArray()
  @IsOptional()
  houseFeatures?: string[];

  @IsArray()
  @IsOptional()
  buildingFeatures?: string[];

  @IsBoolean()
  @IsOptional()
  childrenAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  petsAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  disabledAccess?: boolean;

  @IsBoolean()
  @IsOptional()
  disabledInterior?: boolean;

  @IsNumber()
  @IsOptional()
  monthlyRent?: number;

  @IsNumber()
  @IsOptional()
  deposit?: number;

  @IsString()
  @IsOptional()
  descriptionEs?: string;
}
