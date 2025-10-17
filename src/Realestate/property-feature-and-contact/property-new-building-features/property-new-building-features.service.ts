import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyNewBuildingFeatures } from './entities/property-new-building-features.entity';
import { CreatePropertyNewBuildingFeaturesDto } from './dto/create-property-new-building-features.dto';
import { UpdatePropertyNewBuildingFeaturesDto } from './dto/update-property-new-building-features.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertyNewBuildingFeaturesService {
  constructor(
    @InjectRepository(PropertyNewBuildingFeatures)
    private readonly featuresRepo: Repository<PropertyNewBuildingFeatures>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ✅ Create new building feature (ownership check)
  async create(
    dto: CreatePropertyNewBuildingFeaturesDto,
    userId: number,
  ): Promise<{message: string}> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId)
      throw new ForbiddenException(
        'You cannot add Features to this property',
      );

    const feature = this.featuresRepo.create({ ...dto, property });
    await this.featuresRepo.save(feature);
    return { message: 'Feature created successfully' };
  }

  // ✅ Get all features (public)
  async findAll(): Promise<PropertyNewBuildingFeatures[]> {
    return this.featuresRepo.find({
      relations: ['property', 'property.user'],
    });
  }

  // ✅ Get features for a specific user
  async findByUser(userId: number): Promise<PropertyNewBuildingFeatures[]> {
    return this.featuresRepo
      .createQueryBuilder('feat')
      .leftJoinAndSelect('feat.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ✅ Get single feature (public)
  async findOne(id: string): Promise<PropertyNewBuildingFeatures> {
    const feature = await this.featuresRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!feature) throw new NotFoundException('Feature not found');
    return feature;
  }

  // ✅ Update feature (ownership check)
  async update(
    id: string,
    dto: UpdatePropertyNewBuildingFeaturesDto,
    userId: number,
  ): Promise<PropertyNewBuildingFeatures> {
    const feature = await this.findOne(id);
    if (feature.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this Feature');

    Object.assign(feature, dto);
    return this.featuresRepo.save(feature);
  }

  // ✅ Delete feature (ownership check)
  async remove(
    id: string,
    userId: number,
  ): Promise<{ message: string }> {
    const feature = await this.findOne(id);
    if (feature.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this Feature');

    await this.featuresRepo.remove(feature);
    return { message: 'Feature deleted successfully' };
  }
}
