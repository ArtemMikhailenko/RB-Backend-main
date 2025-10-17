// src/company-details/company-member-test.controller.ts
import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CompanyService } from './company-details.service';
import { CompanyRole } from './entities/company-member.entity';

@Controller('company-member-test')
export class CompanyMemberTestController {
  constructor(private readonly companyService: CompanyService) {}

  // Add a member
  @Post('add')
  async addMember(
    @Body() body: { companyId: number; email: string; role: CompanyRole },
  ) {
    return this.companyService.addMember(body.companyId, body.email, body.role);
  }

  // List members
  @Get(':companyId')
  async listMembers(@Param('companyId') companyId: number) {
    return this.companyService.listMembers(Number(companyId));
  }

  // Remove a member
  @Delete(':companyId/:userId')
  async removeMember(
    @Param('companyId') companyId: number,
    @Param('userId') userId: number,
  ) {
    return this.companyService.removeMember(Number(companyId), Number(userId));
  }
}
