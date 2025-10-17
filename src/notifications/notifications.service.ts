import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { PartnerGateway } from 'src/partners/partner.gateway';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly gateway: PartnerGateway,
  ) {}

  async sendPartnerRequest(sender: User, receiver: User) {
    // 1️⃣ WebSocket push
    this.gateway.sendPartnerRequestNotification(receiver.id, {
      type: 'partner_request',
      message: `${sender.firstName} ${sender.lastName} sent you a partner request`,
      senderId: sender.id,
    });

    // 2️⃣ Email push using template
    await this.mailerService.sendMail(
      receiver.email,          // recipient
      'New Partner Request',   // subject
      'partner-request',       // template name (create this HTML template later)
      {
        SENDER_NAME: `${sender.firstName} ${sender.lastName}`,
        BASE_URL: process.env.APP_BASE_URL || '',
      },
    );
  }
  async sendPartnerRequestAccepted(sender: User, receiver: User) {
  // WebSocket notification
  this.gateway.sendPartnerRequestNotification(receiver.id, {
    type: 'partner_request_accepted',
    message: `${sender.firstName} ${sender.lastName} accepted your partner request`,
    senderId: sender.id,
  });

  // Simple plain-text email
  await this.mailerService.sendMail(
    receiver.email,
    'Partner Request Accepted',
    "", // no template for now
    {
      text: `${sender.firstName} ${sender.lastName} has accepted your partner request.`,
    },
  );
}

}
