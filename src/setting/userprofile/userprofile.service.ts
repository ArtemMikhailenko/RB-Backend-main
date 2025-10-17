import { join } from 'path';
import * as fs from 'fs';
import { instanceToPlain } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/userprofile.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateUserProfileDto } from './dto/create-userprofile.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: number, dto: CreateUserProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Sync user data if provided
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.email) user.email = dto.email;
    if (dto.profilePic) user.profilePic = dto.profilePic; // Assuming profileImage is a field in User entit
    await this.userRepo.save(user);

    const profile = this.profileRepo.create({ ...dto, user });
    return await this.profileRepo.save(profile);
  }

  async findOne(userId: number) {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
      select: {
        id: true,
        phone: true,
        language: true,
        timezone: true,
        linkedIn: true,
        twitter: true,
        facebook: true,
        instagram: true,
        tiktok: true,
        whatsapp: true,
        viber: true,
        telegram: true,
        user: {
          firstName: true,
          lastName: true,
          email: true,
          profilePic: true,
          provider: true,
        },
      },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(userId: number, dto: UpdateUserProfileDto) {
    console.log('Incoming DTO:', dto);
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) throw new NotFoundException('Profile not found');

    // Update user fields
    const user = profile.user;
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.email) user.email = dto.email;
    if (dto.profilePic !== undefined) {
      const oldFileName = profile.user.profilePic?.split('/').pop();
      if (oldFileName) {
        const oldPath = join(
          process.cwd(),
          'uploads/profile-pics',
          oldFileName,
        );
        console.log('Deleting old file:', oldPath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log('Old file deleted');
        } else {
          console.log('Old file not found');
        }
      }
      if (dto.profilePic.startsWith('data:image')) {
        if (process.env.ENV === 'local') {
          const uploadDir = join(process.cwd(), 'uploads/profile-pics');
          // 2️⃣ Ensure directory exists
          fs.mkdirSync(uploadDir, { recursive: true });
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
          const uploadPath = join(uploadDir, fileName);

          // 5️⃣ Extract base64 and save
          const base64Data = dto.profilePic.split(';base64,').pop();
          if (!base64Data) throw new Error('Invalid base64 image string');
          fs.writeFileSync(uploadPath, Buffer.from(base64Data, 'base64'));

          // 6️⃣ Save only filename in DB
          user.profilePic = fileName;
        } else {
          // TODO: later for S3
        }
      } else {
        // Already a stored path or URL
        user.profilePic = dto.profilePic;
      }
    }

    await this.userRepo.save(user);

    // Update profile fields (but exclude user-related stuff from dto to avoid overwrite)
    const { firstName, lastName, email, profilePic, ...profileUpdates } = dto;
    Object.assign(profile, profileUpdates);

    return await this.profileRepo.save(profile);
  }
}
