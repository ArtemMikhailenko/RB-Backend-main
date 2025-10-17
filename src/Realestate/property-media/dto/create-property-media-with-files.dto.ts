// src/property-media/dto/create-property-media-with-files.dto.ts
import { IsUUID, IsOptional, IsUrl, IsArray,ArrayNotEmpty,IsString } from 'class-validator';

export class CreatePropertyMediaWithFilesDto {

  @IsUUID()
  propertyId: string;

@IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  virtualTour?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'images array cannot be empty' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'pdfs array cannot be empty' })
  @IsString({ each: true, message: 'Each PDF must be a string' })
  pdfs?: string[];
}
