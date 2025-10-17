import { Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity, OpportunityStatus } from './entities/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { User } from 'src/auth/entities/user.entity';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepo: Repository<Opportunity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateOpportunityDto, userId: number): Promise<Opportunity> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const opportunity = this.opportunityRepo.create({
      ...dto,
      user,
    });

    return this.opportunityRepo.save(opportunity);
  }

async findAll(page = 1, limit = 10): Promise<{ data: Opportunity[]; total: number; page: number; limit: number }> {
  const [data, total] = await this.opportunityRepo.findAndCount({
    where: { status: OpportunityStatus.ACTIVE },
    relations: ['user'],
    select: {
      id: true,
      method: true,
      need: true,
      status: true,
      location: true,
      bedrooms: true,
      bathrooms: true,
      price: true,
      propertyType: true,
      toggles: true,
      createdAt: true,
      description: true,
      user: {
        id: true,
        firstName: true,
        lastName: true,
        profilePic: true,
        email: true,
      },
    },
    order: { createdAt: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });
  console.log("📦 Sending opportunities:", {
    page,
    limit,
    count: data.length,
    total,
  });
  return {
    data,
    total,
    page,
    limit,
  };
}


  async findOne(id: number): Promise<Opportunity> {
    const opp = await this.opportunityRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!opp) throw new NotFoundException('Opportunity not found');
    return opp;
  }

/** 🔹 Get logged-in user opportunities */
  async findMyOpportunities(userId: number): Promise<Opportunity[]> {
    return this.opportunityRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /** 🔹 Update opportunity */
  async update(id: number, dto: UpdateOpportunityDto, userId: number): Promise<Opportunity> {
    const opp = await this.findOne(id);
    if (opp.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this opportunity');
    }

    Object.assign(opp, dto);
    return this.opportunityRepo.save(opp);
  }

  /** 🔹 Delete opportunity */
  async remove(id: number, userId: number): Promise<void> {
    const opp = await this.findOne(id);
    if (opp.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this opportunity');
    }
    await this.opportunityRepo.remove(opp);
  }
}
