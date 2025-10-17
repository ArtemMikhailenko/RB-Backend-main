import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyNewBuildingFeatures } from './entities/property-new-building-features.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';
import { PropertyNewBuildingFeaturesService } from './property-new-building-features.service';
import { PropertyNewBuildingFeaturesController } from './property-new-building-features.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyNewBuildingFeatures, Property])],
  controllers: [PropertyNewBuildingFeaturesController],
  providers: [PropertyNewBuildingFeaturesService],
  exports: [PropertyNewBuildingFeaturesService],
})
export class PropertyNewBuildingFeaturesModule {}
