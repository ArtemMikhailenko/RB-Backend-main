import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { PartnerGateway } from 'src/partners/partner.gateway';
import { Notification } from './entities/notification.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([Notification, User]), // ✅ add this
  ],
  controllers: [NotificationsController],
  providers: [NotificationService, PartnerGateway],
  exports: [NotificationService],
})
export class NotificationsModule {}
