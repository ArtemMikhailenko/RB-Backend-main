import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRentDetails } from './entities/property-rent-details.entity';
import { CreatePropertyRentDetailsDto } from './dto/create-property-rent-details.dto';
import { UpdatePropertyRentDetailsDto } from './dto/update-property-rent-details.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertyRentDetailsService {
  constructor(
    @InjectRepository(PropertyRentDetails)
    private readonly rentDetailsRepo: Repository<PropertyRentDetails>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ✅ Create rent detail (ownership check)
  async create(dto: CreatePropertyRentDetailsDto, userId: number): Promise<{ message: string }> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId)
      throw new ForbiddenException('You cannot add Rent Details to this property');

    const rentDetail = this.rentDetailsRepo.create({ ...dto, property });
    await this.rentDetailsRepo.save(rentDetail);
    return { message: `Rent Detail created` };
  }

  // ✅ Get all rent details (public)
  async findAll(): Promise<PropertyRentDetails[]> {
    return this.rentDetailsRepo.find({ relations: ['property', 'property.user'] });
  }

  // ✅ Get rent details for a specific user
  async findByUser(userId: number): Promise<PropertyRentDetails[]> {
    return this.rentDetailsRepo
      .createQueryBuilder('rd')
      .leftJoinAndSelect('rd.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ✅ Get single rent detail (public)
  async findOne(id: string): Promise<PropertyRentDetails> {
    const rentDetail = await this.rentDetailsRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!rentDetail) throw new NotFoundException('Rent detail not found');
    return rentDetail;
  }

  // ✅ Update rent detail (ownership check)
  async update(
    id: string,
    dto: UpdatePropertyRentDetailsDto,
    userId: number,
  ): Promise<PropertyRentDetails> {
    const rentDetail = await this.findOne(id);
    if (rentDetail.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this Rent Detail');

    Object.assign(rentDetail, dto);
    return this.rentDetailsRepo.save(rentDetail);
  }

  // ✅ Delete rent detail (ownership check)
  async remove(id: string, userId: number): Promise<{ message: string }> {
    const rentDetail = await this.findOne(id);
    if (rentDetail.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this Rent Detail');

    await this.rentDetailsRepo.remove(rentDetail);
    return { message: 'Rent Detail deleted successfully' };
  }
}
