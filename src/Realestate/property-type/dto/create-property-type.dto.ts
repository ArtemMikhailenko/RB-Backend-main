// src/property-type/dto/create-property-type.dto.ts
import { IsString, IsOptional, IsArray, ArrayNotEmpty, isString } from 'class-validator';

export class CreatePropertyTypeDto {
  
  @IsString()
  propertyId:string;

  @IsString()
  propertyType: string; // required from grid selection

  @IsOptional()
  @IsString()
  category?: string; // optional text input

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[]; // optional array of tags
}
