// src/Realestate/rent-contact/dto/update-rent-contact.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRentContactDto } from './create-rent-contact.dto';

export class UpdateRentContactDto extends PartialType(CreateRentContactDto) {}
