import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyMedia } from './entities/property-media.entity';
import { PropertyMediaService } from './property-media.service';
import { PropertyMediaController } from './property-media.controller';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyMedia, Property])],
  controllers: [PropertyMediaController],
  providers: [PropertyMediaService],
})
export class PropertyMediaModule {}
