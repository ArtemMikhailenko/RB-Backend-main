// src/Realestate/rent-contact/rent-contact.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentContact } from './entities/rent-contact.entity';
import { RentContactService } from './property-rent-contact.service';
import { RentContactController } from './property-rent-contact.controller';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentContact, Property])],
  controllers: [RentContactController],
  providers: [RentContactService],
  exports: [RentContactService],
})
export class RentContactModule {}
