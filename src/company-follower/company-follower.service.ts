// src/company-followers/company-followers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyFollower } from './entities/company-follower.entity';
import { Company } from 'src/setting/company-details/entities/company.entity';
import { User } from 'src/auth/entities/user.entity';
import { FollowerDto } from './dto/follower.dto';
import { FollowingDto } from './dto/following.dto';

@Injectable()
export class CompanyFollowersService {
  constructor(
    @InjectRepository(CompanyFollower)
    private readonly followerRepo: Repository<CompanyFollower>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** 🔹 Follow a company */
  async followCompany(userId: number, companyId: number) {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.followerRepo.findOne({
      where: { user: { id: userId }, company: { id: companyId } },
    });
    if (existing) throw new BadRequestException('Already following this company');

    const follow = this.followerRepo.create({ user, company });
    await this.followerRepo.save(follow);

    return { message: 'You are now following this company.' };
  }

  /** 🔹 Unfollow a company */
  async unfollowCompany(userId: number, companyId: number) {
    const existing = await this.followerRepo.findOne({
      where: { user: { id: userId }, company: { id: companyId } },
    });

    if (!existing) throw new NotFoundException('Not following this company');

    await this.followerRepo.remove(existing);
    return { message: 'Unfollowed successfully' };
  }

  /** 🔹 Get all followers of a company */
  async getCompanyFollowers(companyId: number): Promise<FollowerDto[]> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const followers = await this.followerRepo.find({
      where: { company: { id: companyId } },
      relations: ['user'],
    });

    return followers.map(f => ({
      id: f.user.id,
      name: `${f.user.firstName} ${f.user.lastName}`,
      email: f.user.email,
      profilePicture: f.user.profilePic || undefined, // assuming field exists in User
    }));
  }

  /** 🔹 Get all companies a user follows */
  async getUserFollowing(userId: number): Promise<FollowingDto[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const following = await this.followerRepo.find({
      where: { user: { id: userId } },
      relations: ['company'],
    });

    return following.map(f => ({
      id: f.company.id,
      companyName: f.company.companyName,
      industry: f.company.industry,
      companyLogo: f.company.companyLogo,
    }));
  }
}
