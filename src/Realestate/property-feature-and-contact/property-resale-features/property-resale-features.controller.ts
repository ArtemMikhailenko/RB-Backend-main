// src/Realestate/property-resale-features/property-resale-features.controller.ts
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
import { PropertyResaleFeaturesService } from './property-resale-features.service';
import { CreatePropertyResaleFeaturesDto } from './dto/create-property-resale-features.dto';
import { UpdatePropertyResaleFeaturesDto } from './dto/update-property-resale-features.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-resale-features')
export class PropertyResaleFeaturesController {
  constructor(
    private readonly resaleService: PropertyResaleFeaturesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyResaleFeaturesDto, @Request() req) {
    const userId = req.user.id;
    return this.resaleService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.resaleService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Request() req) {
    const userId = req.user.id;
    return this.resaleService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resaleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyResaleFeaturesDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.resaleService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.resaleService.remove(id, userId);
  }
}
