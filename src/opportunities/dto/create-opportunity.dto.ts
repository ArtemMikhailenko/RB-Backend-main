import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import {
  OpportunityMethod,
  OpportunityNeed,
  OpportunityStatus,
} from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @IsEnum(OpportunityMethod)
  method: OpportunityMethod;

  @IsEnum(OpportunityNeed)
  need: OpportunityNeed;

  @IsEnum(OpportunityStatus)
  @IsOptional()
  status?: OpportunityStatus;

  // Only for SIMPLE
  @IsOptional()
  @IsString()
  description?: string;

  // Only for ADVANCED
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsArray()
  preferences?: string[];

  @IsOptional()
  @IsObject()
  toggles?: Record<string, any>; // ✅ add this
}
