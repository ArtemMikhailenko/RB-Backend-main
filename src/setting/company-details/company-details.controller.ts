import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CompanyService } from './company-details.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyRole } from './entities/company-member.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Get my company
  @Get()
  async getMyCompany(@Req() req) {
    return this.companyService.getCompanyByUser(req.user.id);
  }

  // Update my company
  @Patch()
  async updateMyCompany(@Req() req, @Body() dto: UpdateCompanyDto) {
    return this.companyService.createOrUpdateCompany(req.user.id, dto);
  }
  //create my company
  @Post()
  async createMyCompany(@Req() req, @Body() dto: CreateCompanyDto) {
    return this.companyService.createOrUpdateCompany(req.user.id, dto);
  }

  // Add a member
  @Post(':companyId/members')
  async addMember(
    @Param('companyId') companyId: number,
    @Body('email') email: string,
    @Body('role') role: CompanyRole,
  ) {
    return this.companyService.addMember(companyId, email, role);
  }

  // List all members
  @Get(':companyId/members')
  async listMembers(@Param('companyId') companyId: number) {
    return this.companyService.listMembers(companyId);
  }

  // Remove a member
  @Delete(':companyId/members/:userId')
  async removeMember(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ) {
    // Convert params to numbers before passing to service
    return this.companyService.removeMember(Number(companyId), Number(userId));
  }
}
