import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertySaleDetailsService } from './property-sale-details.service';
import { PropertySaleDetailsController } from './property-sale-details.controller';
import { PropertySaleDetails } from './entities/property-sale-details.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertySaleDetails, Property])],
  controllers: [PropertySaleDetailsController],
  providers: [PropertySaleDetailsService],
})
export class PropertySaleDetailsModule {}
