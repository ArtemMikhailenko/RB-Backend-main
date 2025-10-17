import { PartialType } from '@nestjs/mapped-types';
import { CreateNewBuildingDetailsDto } from './create-new-building-details.dto';

export class UpdateNewBuildingDetailsDto extends PartialType(CreateNewBuildingDetailsDto) {}
