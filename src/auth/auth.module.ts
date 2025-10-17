// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailerModule } from '../mailer/mailer.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpCleanupService } from './otp-cleanup/otp-cleanup.service';
import { UserProfileModule } from '../setting/userprofile/userprofile.module';
import { CompanyDetailsModule } from '../setting/company-details/company-details.module'; //

// Conditionally include GoogleStrategy only if env is configured
const googleProviders = [] as any[];
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL
) {
  googleProviders.push(GoogleStrategy);
} else {
  // eslint-disable-next-line no-console
  console.warn(
    '[AuthModule] Google OAuth is disabled: missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_CALLBACK_URL',
  );
}

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, PasswordReset]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
    MailerModule,
    UserProfileModule, 
    CompanyDetailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpCleanupService, ...googleProviders],
})
export class AuthModule {}
