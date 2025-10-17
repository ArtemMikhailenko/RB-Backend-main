import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity,User])],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  exports: [TypeOrmModule],
})
export class OpportunitiesModule {}
