import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, Put ,Query} from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  /** 🔹 Create new opportunity */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOpportunityDto, @Req() req) {
    return this.opportunitiesService.create(dto, req.user.id);
  }

  /** 🔹 Get all opportunities (feed) */
@Get()
async findAll(
  @Query('page') page = '1',
  @Query('limit') limit = '5',
) {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const limitNumber = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));

  return this.opportunitiesService.findAll(pageNumber, limitNumber);
}


   
  /** 🔹 Get my opportunities */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMy(@Req() req) {
    return this.opportunitiesService.findMyOpportunities(req.user.id);
  }

  /** 🔹 Get one opportunity */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(+id);
  }
  
  /** 🔹 Update opportunity */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
    @Req() req,
  ) {
    return this.opportunitiesService.update(+id, dto, req.user.id);
  }

  /** 🔹 Delete opportunity */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.opportunitiesService.remove(+id, req.user.id);
  }
}
