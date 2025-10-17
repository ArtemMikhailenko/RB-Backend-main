import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyRentDetails } from './entities/property-rent-details.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';
import { PropertyRentDetailsController } from './property-rent-details.controller';
import { PropertyRentDetailsService } from './property-rent-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyRentDetails, Property])],
  controllers: [PropertyRentDetailsController],
  providers: [PropertyRentDetailsService],
})
export class PropertyRentDetailsModule {}
