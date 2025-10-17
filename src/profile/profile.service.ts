import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

async getUserProfile(id: number) {
  const user = await this.userRepository.findOne({
    where: { id },
    select: [
      'id',
      'firstName',
      'lastName',
      'email',
      'profilePic',
      'googleId',
      'provider',
      'country',
    ],
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}

  }

