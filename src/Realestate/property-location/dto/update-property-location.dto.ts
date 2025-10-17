import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyLocationDto } from './create-property-location.dto';

export class UpdatePropertyLocationDto extends PartialType(CreatePropertyLocationDto) {}
