// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { GoogleUserDto } from './dto/google-auth.dto';
import { PasswordReset } from './entities/password-reset.entity'; // 👈 import your entity
import { randomBytes } from 'crypto'; // 👈 for secure token
import { MailerService } from '../mailer/mailer.service'; // adjust path
import { UserProfile } from 'src/setting/userprofile/entities/userprofile.entity'; // Import UserProfile entity
import { Company } from 'src/setting/company-details/entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(UserProfile)
    private userProfileRepo: Repository<UserProfile>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(PasswordReset)
    private resetRepo: Repository<PasswordReset>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    const savedUser = await this.userRepo.save(user);
    const userProfile = this.userProfileRepo.create({
      user: savedUser,
    });
    await this.userProfileRepo.save(userProfile);

    const token = this.jwtService.sign({
      sub: savedUser.id,
      email: savedUser.email,
    });

    return { message: 'User created successfully', token };
  }
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException("Email doesn't exist");
    }

    if (user.provider !== 'local' || !user.password) {
      // Covers both: Google users and corrupted entries with missing passwords
      throw new UnauthorizedException('Please login using Google');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { message: 'Login successful', token };
  }

async updatePasswordWithCurrent(
  userId: number,
  currentPassword: string,
  newPassword: string,
) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Prevent null password case (e.g. Google signup users)
  if (!user.password) {
    throw new BadRequestException('This account does not have a password set.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await this.userRepo.save(user);

  return { message: 'Password updated successfully' };
}


  async googleLogin(dto: GoogleUserDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      // Optional: Prevent non-Google accounts from using this route
      if (existing.provider !== 'google') {
        throw new UnauthorizedException('Please login using your password');
      }

      const token = this.jwtService.sign({
        sub: existing.id,
        email: existing.email,
      });
      return { message: 'Login successful', token };
    }

    const user = this.userRepo.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: null, // No password for Google
      provider: 'google', // Identify login type
      googleId: dto.googleId || null,
      profilePic: dto.profilePic || null,
    });

    const newUser = await this.userRepo.save(user);
    const userProfile = this.userProfileRepo.create({
      user: newUser,
    });
    await this.userProfileRepo.save(userProfile);

    const token = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
    });

    return { message: 'User created via Google', token };
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (user.provider === 'google') {
      throw new BadRequestException(
        'Password reset is not allowed for Google accounts',
      );
    }
    // ⏱️ Check if a request was made in the last 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentOtp = await this.resetRepo.findOne({
      where: {
        userId: user.id,
        createdAt: MoreThan(oneMinuteAgo),
      },
      order: { createdAt: 'DESC' }, // get latest one if multiple
    });

    if (recentOtp) {
      throw new ConflictException('You can request a new OTP after 1 minute.');
    }

    // 🔐 Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // OTP expires in 10 mins

    const resetEntry = this.resetRepo.create({
      user,
      userId: user.id,
      otp,
      expiresAt: expiry,
    });

    await this.resetRepo.save(resetEntry);
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    await this.mailerService.sendResetCode(user.email, otp, fullName); // Send OTP

    return {
      message: 'OTP has been sent to your email',
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email not found');
    if (user.provider === 'google') {
      throw new BadRequestException(
        'OTP verification not allowed for Google accounts',
      );
    }

    const resetEntry = await this.resetRepo.findOne({
      where: {
        userId: user.id,
        otp,
      },
      order: { createdAt: 'DESC' },
    });

    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // ✅ Generate short-lived JWT token
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '10m' }, // token only valid for 10 minutes
    );

    return { message: 'OTP is valid', resetToken };
  }

  async resetPasswordWithJwt(userId: number, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // ✅ safer: check provider, not password field
    if (user.provider === 'google') {
      throw new BadRequestException(
        'Password reset is not allowed for Google login users.',
      );
    }

    if (!newPassword || newPassword.trim() === '') {
      throw new BadRequestException('New password must be provided');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    await this.resetRepo.delete({ userId });

    return { message: 'Password has been reset successfully' };
  }
}
