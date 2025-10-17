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
import { PropertyNewBuildingFeaturesService } from './property-new-building-features.service';
import { CreatePropertyNewBuildingFeaturesDto } from './dto/create-property-new-building-features.dto';
import { UpdatePropertyNewBuildingFeaturesDto } from './dto/update-property-new-building-features.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-new-building-features')
export class PropertyNewBuildingFeaturesController {
  constructor(
    private readonly featuresService: PropertyNewBuildingFeaturesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyNewBuildingFeaturesDto, @Request() req) {
    const userId = req.user.id; // passed directly
    return this.featuresService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.featuresService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyFeatures(@Request() req) {
    const userId = req.user.id; // passed directly
    return this.featuresService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featuresService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyNewBuildingFeaturesDto,
    @Request() req,
  ) {
    const userId = req.user.id; // passed directly
    return this.featuresService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // passed directly
    return this.featuresService.remove(id, userId);
  }
}
