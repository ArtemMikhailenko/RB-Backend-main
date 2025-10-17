import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxInformation } from './entities/tax-information.entity';
import { CreateTaxInformationDto } from './dto/create-tax-information.dto';
import { UpdateTaxInformationDto } from './dto/update-tax-information.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TaxInformationService {
  constructor(
    @InjectRepository(TaxInformation)
    private readonly taxInformationRepository: Repository<TaxInformation>,
  ) {}

  async createOrUpdate(
    createDto: CreateTaxInformationDto,
    user: User,
  ): Promise<TaxInformation> {
    // Check if user already has tax information
    const existing = await this.taxInformationRepository.findOne({ where: { user: { id: user.id } } });

    if (existing) {
      // Update existing record
      Object.assign(existing, createDto);
      return this.taxInformationRepository.save(existing);
    }

    // Create new record
    const taxInfo = this.taxInformationRepository.create({
      ...createDto,
      user,
    });
    return this.taxInformationRepository.save(taxInfo);
  }

  async findByUser(userId: number): Promise<Partial<TaxInformation>>  {
    const taxInfo = await this.taxInformationRepository.findOne({
      where: { user: { id: userId } },
      select:{
        id:true,
        companyName:true,
        taxId:true,
        addressLine1:true,
        addressLine2:true,
        city:true,
        state:true,
        zipCode:true,
        country:true,
      }
    });

    return taxInfo || {};
  }

async update(
  user: User,
  updateDto: UpdateTaxInformationDto,
): Promise<TaxInformation> {
  return this.createOrUpdate(updateDto as CreateTaxInformationDto, user);
}

}
