// src/property-media/dto/update-property-media.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyMediaDto } from './create-property-media.dto';

export class UpdatePropertyMediaDto extends PartialType(CreatePropertyMediaDto) {}
