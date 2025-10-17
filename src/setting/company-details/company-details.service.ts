import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/auth/entities/user.entity';
import { CompanyMember } from './entities/company-member.entity';
import { CompanyRole } from './entities/company-member.entity';




@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
      @InjectRepository(User)
  private readonly userRepo: Repository<User>,

  @InjectRepository(CompanyMember)
  private readonly companyMemberRepo: Repository<CompanyMember>,
  ) {}

  async getCompanyByUser(userId: number) {
    const company = await this.companyRepo.findOne({ where: { userId } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async createOrUpdateCompany(userId: number, dto: CreateCompanyDto | UpdateCompanyDto) {
    let company = await this.companyRepo.findOne({ where: { userId } });
    if (!company) {
      company = this.companyRepo.create({ ...dto, userId });
    } else {
      Object.assign(company, dto);
    }
    return await this.companyRepo.save(company);
  }

async addMember(companyId: number, email: string, role: CompanyRole) {
  const company = await this.companyRepo.findOne({ where: { id: companyId } });
  if (!company) throw new NotFoundException('Company not found');

  const user = await this.userRepo.findOne({ where: { email } });
  if (!user) throw new NotFoundException('User not found');

  const existingMember = await this.companyMemberRepo.findOne({
    where: { companyId, userId: user.id },
  });
  if (existingMember) throw new Error('User is already a member of this company');

  const member = this.companyMemberRepo.create({
    company,
    user,
    companyId: company.id,
    userId: user.id,
    role,
  });

  return await this.companyMemberRepo.save(member);
}

async listMembers(companyId: number) {
  return await this.companyMemberRepo.find({
    where: { companyId },
    relations: ['user'],
  });
}

async removeMember(companyId: number, userId: number) {
  const member = await this.companyMemberRepo.findOne({
    where: { companyId, userId },
  });

  if (!member) throw new NotFoundException('Member not found');

  await this.companyMemberRepo.remove(member);
  return { message: 'Member removed successfully' };
}



}
