import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertySaleDetails } from './entities/property-sale-details.entity';
import { CreatePropertySaleDetailsDto } from './dto/create-property-sale-details.dto';
import { UpdatePropertySaleDetailsDto } from './dto/update-property-sale-details.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertySaleDetailsService {
  constructor(
    @InjectRepository(PropertySaleDetails)
    private readonly saleDetailsRepo: Repository<PropertySaleDetails>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ✅ Create sale detail (ownership check)
  async create(dto: CreatePropertySaleDetailsDto, userId: number): Promise<{ message: string }> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId)
      throw new ForbiddenException('You cannot add Sale Details to this property');

    const saleDetail = this.saleDetailsRepo.create({ ...dto, property });
    await this.saleDetailsRepo.save(saleDetail);
    return { message: `Sale Detail created` };
  }

  // ✅ Get all sale details (public)
  async findAll(): Promise<PropertySaleDetails[]> {
    return this.saleDetailsRepo.find({ relations: ['property', 'property.user'] });
  }

  // ✅ Get sale details for a specific user
  async findByUser(userId: number): Promise<PropertySaleDetails[]> {
    return this.saleDetailsRepo
      .createQueryBuilder('sd')
      .leftJoinAndSelect('sd.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ✅ Get single sale detail (public)
  async findOne(id: string): Promise<PropertySaleDetails> {
    const saleDetail = await this.saleDetailsRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!saleDetail) throw new NotFoundException('Sale detail not found');
    return saleDetail;
  }

  // ✅ Update sale detail (ownership check)
  async update(
    id: string,
    dto: UpdatePropertySaleDetailsDto,
    userId: number,
  ): Promise<PropertySaleDetails> {
    const saleDetail = await this.findOne(id);
    if (saleDetail.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this Sale Detail');

    Object.assign(saleDetail, dto);
    return this.saleDetailsRepo.save(saleDetail);
  }

  // ✅ Delete sale detail (ownership check)
  async remove(id: string, userId: number): Promise<{ message: string }> {
    const saleDetail = await this.findOne(id);
    if (saleDetail.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this Sale Detail');

    await this.saleDetailsRepo.remove(saleDetail);
    return { message: 'Sale Detail deleted successfully' };
  }
}
