// src/company-followers/company-followers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyFollowersService } from './company-follower.service';
import { CompanyFollowersController } from './company-follower.controller';
import { CompanyFollower } from './entities/company-follower.entity';
import { Company } from 'src/setting/company-details/entities/company.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyFollower, Company, User])],
  providers: [CompanyFollowersService],
  controllers: [CompanyFollowersController],
  exports: [CompanyFollowersService],
})
export class CompanyFollowersModule {}
