// src/property/dto/create-property.dto.ts
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PropertyPurpose, PropertyPurposeOption} from '../entities/property.entity';

export class CreatePropertyDto {
  @IsEnum(PropertyPurpose)
  purpose: PropertyPurpose;

  @IsEnum(PropertyPurposeOption)
  purposeOption: PropertyPurposeOption;

  @IsOptional()
  isPublished?: boolean;
}
