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
import { PropertyRentDetailsService } from './property-rent-details.service';
import { CreatePropertyRentDetailsDto } from './dto/create-property-rent-details.dto';
import { UpdatePropertyRentDetailsDto } from './dto/update-property-rent-details.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-rent-details')
export class PropertyRentDetailsController {
  constructor(
    private readonly rentDetailsService: PropertyRentDetailsService,
  ) {}

  // ✅ Create rent details (auth required)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyRentDetailsDto, @Request() req) {
    const userId = req.user.id; // take from JWT payload
    return this.rentDetailsService.create(dto, userId);
  }

  // ✅ Get all rent details (public)
  @Get()
  findAll() {
    return this.rentDetailsService.findAll();
  }

  // ✅ Get my rent details (auth required)
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyRentDetails(@Request() req) {
    const userId = req.user.id;
    return this.rentDetailsService.findByUser(userId);
  }

  // ✅ Get single rent detail (public)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentDetailsService.findOne(id);
  }

  // ✅ Update rent details (auth required)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyRentDetailsDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.rentDetailsService.update(id, dto, userId);
  }

  // ✅ Delete rent details (auth required)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.rentDetailsService.remove(id, userId);
  }
}
