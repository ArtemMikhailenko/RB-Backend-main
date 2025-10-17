// src/property-location/property-location.controller.ts
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
} from '@nestjs/common';
import { PropertyLocationService } from './property-location.service';
import { CreatePropertyLocationDto } from './dto/create-property-location.dto';
import { UpdatePropertyLocationDto } from './dto/update-property-location.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-locations')
export class PropertyLocationController {
  constructor(private readonly locationService: PropertyLocationService) {}

  // ✅ Create property location (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyLocationDto, @Request() req) {
    const userId = req.user.id;
    return this.locationService.create(dto, userId);
  }

  // ✅ Get all property locations (admin/debug)
  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  // ✅ Get all property locations created by logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyLocations(@Request() req) {
    const userId = req.user.id;
    return this.locationService.findByUser(userId);
  }

  // ✅ Get single property location by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  // ✅ Update property location (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyLocationDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.locationService.update(id, dto, userId);
  }

  // ✅ Delete property location (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.locationService.remove(id, userId);
  }
}
