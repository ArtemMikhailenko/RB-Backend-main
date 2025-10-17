// partners.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { PartnerRequest } from './entities/partner-request.entity';
import { Partner } from './entities/partner.entity';
import { User } from 'src/auth/entities/user.entity'; // adjust path if different
import { PartnerGateway } from './partner.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerRequest, User,Partner]), // 👈 make repositories available
    NotificationsModule 
  ],
  controllers: [PartnersController],
  providers: [PartnersService,PartnerGateway],
  exports: [PartnersService], // optional if you use it elsewhere
})
export class PartnersModule {}
