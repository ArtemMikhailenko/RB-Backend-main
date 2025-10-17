// src/company-followers/company-followers.controller.ts
import { Controller, Post, Delete, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { CompanyFollowersService } from './company-follower.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('companies')
export class CompanyFollowersController {
  constructor(private readonly followersService: CompanyFollowersService) {}

  /** 🔹 Follow a company */
  @UseGuards(JwtAuthGuard)
  @Post(':companyId/follow')
  async followCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.followersService.followCompany(userId, companyId);
  }

  /** 🔹 Unfollow a company */
  @UseGuards(JwtAuthGuard)
  @Delete(':companyId/unfollow')
  async unfollowCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.followersService.unfollowCompany(userId, companyId);
  }

  /** 🔹 Get all followers of a company */
  @Get(':companyId/followers')
  async getCompanyFollowers(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.followersService.getCompanyFollowers(companyId);
  }

  /** 🔹 Get all companies a user follows */
  @UseGuards(JwtAuthGuard)
  @Get('me/following')
  async getUserFollowing(@Req() req) {
    const userId = req.user.id;
    return this.followersService.getUserFollowing(userId);
  }
}
