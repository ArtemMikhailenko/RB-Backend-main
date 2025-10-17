// src/property-media/dto/create-property-media-array.dto.ts
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePropertyMediaDto } from './create-property-media.dto';

export class CreatePropertyMediaArrayDto {
  // Always validate each object in the array
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyMediaDto)
  @ArrayMinSize(1, { message: 'At least one media item is required' })
  media: CreatePropertyMediaDto[];
}
