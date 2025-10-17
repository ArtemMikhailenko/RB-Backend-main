// src/Realestate/rent-contact/rent-contact.controller.ts
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
import { RentContactService } from './property-rent-contact.service';
import { CreateRentContactDto } from './dto/create-rent-contact.dto';
import { UpdateRentContactDto } from './dto/update-rent-contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('rent-contact')
export class RentContactController {
  constructor(private readonly rentContactService: RentContactService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRentContactDto, @Request() req) {
    const userId = req.user.id;
    return this.rentContactService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.rentContactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Request() req) {
    const userId = req.user.id;
    return this.rentContactService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentContactService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRentContactDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.rentContactService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.rentContactService.remove(id, userId);
  }
}
