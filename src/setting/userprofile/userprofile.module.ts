import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/userprofile.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserProfileService } from './userprofile.service';
import { UserProfileController } from './userprofile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, User]), // register entities here
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService, TypeOrmModule], // export if other modules will use it
})
export class UserProfileModule {}
