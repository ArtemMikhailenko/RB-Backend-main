// src/Realestate/property-resale-features/property-resale-features.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyResaleFeatures } from './entities/property-resale-features.entity';
import { PropertyResaleFeaturesService } from './property-resale-features.service';
import { PropertyResaleFeaturesController } from './property-resale-features.controller';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyResaleFeatures, Property])],
  providers: [PropertyResaleFeaturesService],
  controllers: [PropertyResaleFeaturesController],
})
export class PropertyResaleFeaturesModule {}
