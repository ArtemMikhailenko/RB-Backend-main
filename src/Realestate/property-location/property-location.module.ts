// src/property-location/property-location.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyLocationService } from './property-location.service';
import { PropertyLocationController } from './property-location.controller';
import { PropertyLocation } from './entities/property-location.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyLocation, Property])],
  controllers: [PropertyLocationController],
  providers: [PropertyLocationService],
  exports: [PropertyLocationService],
})
export class PropertyLocationModule {}
