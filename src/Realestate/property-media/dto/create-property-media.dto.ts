// src/property-media/dto/create-property-media.dto.ts
import { IsEnum, IsOptional, IsBoolean, IsUUID, IsUrl, IsNotEmpty } from 'class-validator';
import { MediaType } from './media-type.enum';

export class CreatePropertyMediaDto {
  // Optional URL or file path
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'Invalid URL or file path' })
  url?: string;

  // Required media type
  @IsEnum(MediaType, {
    message: 'type must be one of: IMAGE, VIDEO_FILE, VIDEO_URL, VIRTUAL_TOUR, DOCUMENT',
  })
  type: MediaType;

  // Optional primary flag
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  // Required property ID
  @IsNotEmpty()
  @IsUUID()
  propertyId: string;
}
