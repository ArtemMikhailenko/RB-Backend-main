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
import { NewBuildingDetailsService } from './property-new-building-details.service';
import { CreateNewBuildingDetailsDto } from './dto/create-new-building-details.dto';
import { UpdateNewBuildingDetailsDto } from './dto/update-new-building-details.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('new-building-details')
export class NewBuildingDetailsController {
  constructor(
    private readonly newBuildingDetailsService: NewBuildingDetailsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateNewBuildingDetailsDto, @Request() req) {
    const userId = req.user.id; // passed directly
    return this.newBuildingDetailsService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.newBuildingDetailsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyNewBuildingDetails(@Request() req) {
    const userId = req.user.id; // passed directly
    return this.newBuildingDetailsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newBuildingDetailsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewBuildingDetailsDto,
    @Request() req,
  ) {
    const userId = req.user.id; // passed directly
    return this.newBuildingDetailsService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // passed directly
    return this.newBuildingDetailsService.remove(id, userId);
  }
}
