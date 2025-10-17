// src/Realestate/property-resale-features/dto/update-property-resale-features.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyResaleFeaturesDto } from './create-property-resale-features.dto';

export class UpdatePropertyResaleFeaturesDto extends PartialType(
  CreatePropertyResaleFeaturesDto,
) {}
