import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Res,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // inject ConfigService
  ) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @UseGuards(AuthGuard('jwt')) // use your JWT auth guard
  @Post('change-password')
  resetPassword(@Request() req, @Body() body: { newPassword: string }) {
    const userId = req.user.id;
    return this.authService.resetPasswordWithJwt(userId, body.newPassword);
  }
@UseGuards(AuthGuard('jwt'))
@Post('update-password')
async updatePassword(
  @Request() req,
  @Body() dto: UpdatePasswordDto,
) {
  const userId = req.user.id;
  return this.authService.updatePasswordWithCurrent(
    userId,
    dto.currentPassword,
    dto.newPassword,
  );
}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // Callback after Google login
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const googleUser = req.user; // { email, firstName, lastName }

    // Get token from your service
    const { token } = await this.authService.googleLogin(googleUser);

    // Redirect to frontend with token in query param
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
  }
}
