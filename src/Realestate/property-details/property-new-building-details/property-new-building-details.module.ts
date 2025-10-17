import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewBuildingDetailsController } from './property-new-building-details.controller';
import { NewBuildingDetailsService } from './property-new-building-details.service';
import { NewBuildingDetails } from './entities/new-building-detail.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewBuildingDetails, Property])],
  controllers: [NewBuildingDetailsController],
  providers: [NewBuildingDetailsService],
  exports: [NewBuildingDetailsService], // 👈 optional, only if used outside
})
export class PropertyNewBuildingDetailsModule {}
