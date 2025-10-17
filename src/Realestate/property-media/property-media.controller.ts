import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PropertyMediaService } from './property-media.service';
import { CreatePropertyMediaWithFilesDto } from './dto/create-property-media-with-files.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdatePropertyMediaDto } from './dto/update-property-media.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-media')
export class PropertyMediaController {
  constructor(private readonly propertyMediaService: PropertyMediaService) {}

  // ✅ Create property media (single or array) for logged-in user
  @UseGuards(JwtAuthGuard)
@Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'pdfs', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/property-media', // folder on server
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname)); // e.g., 123456789.jpg
          },
        }),
      },
    ),
  )
  async createMedia(
    @Body() body: CreatePropertyMediaWithFilesDto,
    @UploadedFiles() files: { images?: Express.Multer.File[]; pdfs?: Express.Multer.File[] },
    @Request() req,
  ) {
    const userId = req.user.id;

    return this.propertyMediaService.createWithFilesAndUrls(body, files, userId);
  }


  // ✅ Get all media (for debugging/admin)
  @Get()
  findAll() {
    return this.propertyMediaService.findAll();
  }

  // ✅ Get single media by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyMediaService.findOne(id);
  }

  // ✅ Update media (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyMediaDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.propertyMediaService.update(id, dto, userId);
  }

  // ✅ Delete media (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.propertyMediaService.remove(id, userId);
  }
}
