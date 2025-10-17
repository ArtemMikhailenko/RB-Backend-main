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
import { PropertySaleDetailsService } from './property-sale-details.service';
import { CreatePropertySaleDetailsDto } from './dto/create-property-sale-details.dto';
import { UpdatePropertySaleDetailsDto } from './dto/update-property-sale-details.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('property-sale-details')
export class PropertySaleDetailsController {
  constructor(private readonly saleDetailsService: PropertySaleDetailsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertySaleDetailsDto, @Request() req) {
    const userId = req.user.id; // passed directly
    return this.saleDetailsService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.saleDetailsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMySaleDetails(@Request() req) {
    const userId = req.user.id; // passed directly
    return this.saleDetailsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleDetailsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertySaleDetailsDto,
    @Request() req,
  ) {
    const userId = req.user.id; // passed directly
    return this.saleDetailsService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // passed directly
    return this.saleDetailsService.remove(id, userId);
  }
}
