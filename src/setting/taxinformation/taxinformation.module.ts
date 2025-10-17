import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxInformation } from './entities/tax-information.entity';
import { TaxInformationService } from './taxinformation.service';
import { TaxInformationController } from './taxinformation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaxInformation])],
  controllers: [TaxInformationController],
  providers: [TaxInformationService],
})
export class TaxInformationModule {}
