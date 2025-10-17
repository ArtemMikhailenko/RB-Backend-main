import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertySaleDetailsDto } from './create-property-sale-details.dto';

export class UpdatePropertySaleDetailsDto extends PartialType(CreatePropertySaleDetailsDto) {}
