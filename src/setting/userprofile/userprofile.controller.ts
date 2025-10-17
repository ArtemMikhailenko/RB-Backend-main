import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserProfileService } from './userprofile.service';
import { CreateUserProfileDto } from './dto/create-userprofile.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('userprofile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateUserProfileDto) {
    const userId = req.user?.id || dto['userId'];
    return this.userProfileService.create(userId, dto);
  }

  @Get()
  async findOne(@Request() req) {
    const userId = req.user?.id;
    return this.userProfileService.findOne(userId);
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor('profilePic', {
      storage: diskStorage({
        destination: './uploads/profile-pics',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Request() req,
    @Body() dto: UpdateUserProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user?.id || dto['userId'];
    const profilePicPath = file
      ? `/uploads/profile-pics/${file.filename}`
      : null;

    return this.userProfileService.update(userId, {
      ...dto,
      profilePic: profilePicPath || dto.profilePic,
    });
  }
}
