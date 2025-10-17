import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyNewBuildingFeaturesDto } from './create-property-new-building-features.dto';

export class UpdatePropertyNewBuildingFeaturesDto extends PartialType(
  CreatePropertyNewBuildingFeaturesDto,
) {}
