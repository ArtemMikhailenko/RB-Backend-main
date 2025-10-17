// src/property/property.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // ✅ Create property (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyDto, @Request() req) {
    const userId = req.user.id; // 👈 extracted from JWT
    return this.propertyService.create(userId, dto);
  }

  // ✅ Get all properties (optional: make user-specific later)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.propertyService.findAll({ page, limit });
  }

  // ✅ Get all properties of the logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyProperties(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const userId = req.user.id;
    return this.propertyService.findMyProperties(userId,{page,limit});
  }

  // ✅ Get one property
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  // ✅ Update property (you could also restrict to owner only)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
    @Request() req,
  ) {
    const userId = req.user.id; // for ownership validation later
    return this.propertyService.update(id, dto, userId);
  }

  // ✅ Delete property
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // for ownership validation later
    return this.propertyService.remove(id, userId);
  }
}
