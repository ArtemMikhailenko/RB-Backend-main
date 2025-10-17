// src/profile/profile.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req) {
    console.log('req.user in controller:', req.user); // <- must show the real user
    // Option A: return req.user directly (already sanitized by select)
    return req.user;

    // Option B: if you want extra fields/joins:
    // return this.profileService.getUserProfile(req.user.id);
  }
}
