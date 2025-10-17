import { Controller, Post, Body, Get, Patch, UseGuards } from '@nestjs/common';
import { TaxInformationService } from './taxinformation.service';
import { CreateTaxInformationDto } from './dto/create-tax-information.dto';
import { UpdateTaxInformationDto } from './dto/update-tax-information.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tax-information')
@UseGuards(JwtAuthGuard)
export class TaxInformationController {
  constructor(private readonly taxInformationService: TaxInformationService) {}

  @Post()
  createOrUpdate(
    @Body() createDto: CreateTaxInformationDto,
    @GetUser() user: User,
  ) {
    return this.taxInformationService.createOrUpdate(createDto, user);
  }

  @Get()
  getMyTaxInfo(@GetUser() user: User) {
    return this.taxInformationService.findByUser(user.id);
  }

  @Patch()
  update(
    @Body() updateDto: UpdateTaxInformationDto,
    @GetUser() user: User,
  ) {
    return this.taxInformationService.update(user, updateDto);
  }
}
