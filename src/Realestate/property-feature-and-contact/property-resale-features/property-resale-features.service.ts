// src/Realestate/property-resale-features/property-resale-features.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyResaleFeatures } from './entities/property-resale-features.entity';
import { CreatePropertyResaleFeaturesDto } from './dto/create-property-resale-features.dto';
import { UpdatePropertyResaleFeaturesDto } from './dto/update-property-resale-features.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertyResaleFeaturesService {
  constructor(
    @InjectRepository(PropertyResaleFeatures)
    private readonly resaleRepo: Repository<PropertyResaleFeatures>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ✅ Create resale feature (ownership check)
  async create(
    dto: CreatePropertyResaleFeaturesDto,
    userId: number,
  ): Promise<{message: string}> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId)
      throw new ForbiddenException('You cannot add Features to this property');

    const feature = this.resaleRepo.create({ ...dto, property });
    await this.resaleRepo.save(feature);
    return { message: 'Feature created successfully' };
  }

  // ✅ Get all resale features (public)
  async findAll(): Promise<PropertyResaleFeatures[]> {
    return this.resaleRepo.find({
      relations: ['property', 'property.user'],
    });
  }

  // ✅ Get resale features for a specific user
  async findByUser(userId: number): Promise<PropertyResaleFeatures[]> {
    return this.resaleRepo
      .createQueryBuilder('feat')
      .leftJoinAndSelect('feat.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ✅ Get single resale feature (public)
  async findOne(id: string): Promise<PropertyResaleFeatures> {
    const feature = await this.resaleRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!feature) throw new NotFoundException('Resale feature not found');
    return feature;
  }

  // ✅ Update resale feature (ownership check)
  async update(
    id: string,
    dto: UpdatePropertyResaleFeaturesDto,
    userId: number,
  ): Promise<PropertyResaleFeatures> {
    const feature = await this.findOne(id);
    if (feature.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this Feature');

    Object.assign(feature, dto);
    return this.resaleRepo.save(feature);
  }

  // ✅ Delete resale feature (ownership check)
  async remove(
    id: string,
    userId: number,
  ): Promise<{ message: string }> {
    const feature = await this.findOne(id);
    if (feature.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this Feature');

    await this.resaleRepo.remove(feature);
    return { message: 'Feature deleted successfully' };
  }
}
