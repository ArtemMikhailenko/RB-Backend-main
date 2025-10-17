import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewBuildingDetails } from './entities/new-building-detail.entity';
import { CreateNewBuildingDetailsDto } from './dto/create-new-building-details.dto';
import { UpdateNewBuildingDetailsDto } from './dto/update-new-building-details.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class NewBuildingDetailsService {
  constructor(
    @InjectRepository(NewBuildingDetails)
    private readonly newBuildingRepo: Repository<NewBuildingDetails>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ✅ Create new building detail (ownership check)
  async create(
    dto: CreateNewBuildingDetailsDto,
    userId: number,
  ): Promise<{ message: string }> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId)
      throw new ForbiddenException('You cannot add New Building Details to this property');

    const newBuildingDetail = this.newBuildingRepo.create({ ...dto, property });
    await this.newBuildingRepo.save(newBuildingDetail);
    return { message: `New Building Detail created` };
  }

  // ✅ Get all new building details (public)
  async findAll(): Promise<NewBuildingDetails[]> {
    return this.newBuildingRepo.find({ relations: ['property', 'property.user'] });
  }

  // ✅ Get new building details for a specific user
  async findByUser(userId: number): Promise<NewBuildingDetails[]> {
    return this.newBuildingRepo
      .createQueryBuilder('nbd')
      .leftJoinAndSelect('nbd.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ✅ Get single new building detail (public)
  async findOne(id: string): Promise<NewBuildingDetails> {
    const newBuildingDetail = await this.newBuildingRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!newBuildingDetail) throw new NotFoundException('New Building detail not found');
    return newBuildingDetail;
  }

  // ✅ Update new building detail (ownership check)
  async update(
    id: string,
    dto: UpdateNewBuildingDetailsDto,
    userId: number,
  ): Promise<NewBuildingDetails> {
    const newBuildingDetail = await this.findOne(id);
    if (newBuildingDetail.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this New Building Detail');

    Object.assign(newBuildingDetail, dto);
    return this.newBuildingRepo.save(newBuildingDetail);
  }

  // ✅ Delete new building detail (ownership check)
  async remove(id: string, userId: number): Promise<{ message: string }> {
    const newBuildingDetail = await this.findOne(id);
    if (newBuildingDetail.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this New Building Detail');

    await this.newBuildingRepo.remove(newBuildingDetail);
    return { message: 'New Building Detail deleted successfully' };
  }
}
