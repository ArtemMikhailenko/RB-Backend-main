import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private transporter = nodemailer.createTransport({
    service: 'Gmail', // or SMTP details
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  /**
   * Render an HTML template with variables
   */
  private renderTemplate(templateName: string, variables: Record<string, string>): string {
    const templatePath = path.join(
      'src',
      'mailer',
      'assets',
      'templates',
      `${templateName}.html`,
    );

    if (!fs.existsSync(templatePath)) {
      this.logger.warn(`Template ${templateName}.html not found, using fallback message.`);
      return `<p>Hello,</p><p>This is a fallback email because the template <b>${templateName}</b> is not created yet.</p>`;
    }

    let html = fs.readFileSync(templatePath, 'utf-8');
    for (const [key, value] of Object.entries(variables)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return html;
  }

  /**
   * General send method
   */
  async sendMail(to: string, subject: string, templateName: string, variables?: Record<string, string>) {
    const html = this.renderTemplate(templateName, variables || {});

    const mailOptions = {
      from: `"Your App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Email sent to ${to} using template: ${templateName}`);
  }

  /**
   * Example: Reset Password Email
   */
  async sendResetCode(to: string, code: string, name: string) {
    await this.sendMail(to, 'Reset Your Password', 'reset-password', {
      NAME: name,
      CODE: code,
      BASE_URL: process.env.APP_BASE_URL || '',
    });
  }

  /**
   * Placeholder for future templates
   */
  async sendWelcomeEmail(to: string, name: string) {
    await this.sendMail(to, 'Welcome to Our App 🎉', 'welcome', {
      NAME: name,
    });
  }

  async sendOrderConfirmation(to: string, name: string, orderId: string) {
    await this.sendMail(to, 'Your Order Confirmation', 'order-confirmation', {
      NAME: name,
      ORDER_ID: orderId,
    });
  }
}
