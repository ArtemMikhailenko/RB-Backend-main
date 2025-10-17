import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company-details.controller';
import { CompanyService } from './company-details.service';
import { Company } from './entities/company.entity';
import { CompanyMember } from './entities/company-member.entity';
import { User } from 'src/auth/entities/user.entity';
import { CompanyInvite } from './entities/company-invite.entity';
import { CompanyMemberTestController } from './company-details.controller.spec';

@Module({
  imports: [TypeOrmModule.forFeature([Company,CompanyMember, User, CompanyInvite])],
  controllers: [CompanyController, CompanyMemberTestController],
  providers: [CompanyService],
  exports: [CompanyService,TypeOrmModule],
})
export class CompanyDetailsModule {}
