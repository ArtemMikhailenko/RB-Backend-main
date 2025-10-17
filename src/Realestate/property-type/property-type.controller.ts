import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-types')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  // ✅ Create property type (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyTypeDto, @Request() req) {
    const userId = req.user.id;
    return this.propertyTypeService.create(dto, userId);
  }

  // ✅ Get all property types
  @Get()
  findAll() {
    return this.propertyTypeService.findAll();
  }

  // ✅ Get all property types created by logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyPropertyTypes(@Request() req) {
    const userId = req.user.id;
    return this.propertyTypeService.findByUser(userId);
  }

  // ✅ Get single property type by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyTypeService.findOne(id);
  }

  // ✅ Update property type (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyTypeDto,
    @Request() req,
  ) {
    const userId = req.user.id; // for ownership check if needed
    return this.propertyTypeService.update(id, dto, userId);
  }

  // ✅ Delete property type (logged-in user only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // for ownership check if needed
    return this.propertyTypeService.remove(id, userId);
  }
}
