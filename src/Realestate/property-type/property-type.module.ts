import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyTypeService } from './property-type.service';
import { PropertyTypeController } from './property-type.controller';
import { PropertyType } from './entities/property-type.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType,Property])],
  controllers: [PropertyTypeController],
  providers: [PropertyTypeService],
  exports: [PropertyTypeService], // export if other modules need it
})
export class PropertyTypeModule {}
