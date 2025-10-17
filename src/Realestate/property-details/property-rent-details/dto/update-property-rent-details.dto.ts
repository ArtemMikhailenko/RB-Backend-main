
import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyRentDetailsDto } from './create-property-rent-details.dto';

export class UpdatePropertyRentDetailsDto extends PartialType(CreatePropertyRentDetailsDto) {}

