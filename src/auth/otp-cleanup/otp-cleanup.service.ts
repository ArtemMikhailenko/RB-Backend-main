// src/auth/otp-cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PasswordReset } from '../entities/password-reset.entity';

@Injectable()
export class OtpCleanupService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepo: Repository<PasswordReset>,
  ) {}

  @Cron('0 * * * *') // Runs every hour
  async handleCleanup() {
    const now = new Date();
    const result = await this.passwordResetRepo.delete({
      expiresAt: LessThan(now),
    });

    console.log(`Deleted ${result.affected} expired OTP(s)`);
  }
}
