// src/property/property.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from 'src/auth/entities/user.entity';
import { features } from 'process';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ✅ Create new property linked to logged-in user
  async create(
    userId: number,
    dto: CreatePropertyDto,
  ): Promise<{
    id: string;
    purpose: string;
    purposeOption: string;
  }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const property = this.propertyRepo.create({ ...dto, user });
    const savedProperty = await this.propertyRepo.save(property);
    return {
      id: savedProperty.id,
      purpose: savedProperty.purpose,
      purposeOption: savedProperty.purposeOption,
    };
  }

  // ✅ Get all properties with user info
  async findAll({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ data: any; meta: any }> {
    const [properties, total] = await this.propertyRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: [
        'user',
        'propertyTypes',
        'propertyLocations',
        'media',
        'propertySaleDetails',
        'newBuildingDetails',
        'propertyRentDetails',
        'newBuildingFeatures',
        'resaleFeatures',
        'rentContacts',
      ],
      order: { createdAt: 'DESC' },
    });
    const data = properties.map((p) => ({
      id: p.id,
      purpose: p.purpose,
      purposeOption: p.purposeOption,
      isPublished: p.isPublished,
      user: {
        id: p.user.id,
        name: p.user.firstName + ' ' + p.user.lastName,
        profilePic: p.user.profilePicUrl,
        createdAt: p.user.createdAt,
      },
      propertyTypes: p.propertyTypes?.map((t) => ({
        id: t.id,
        propertyType: t.propertyType,
        category: t.category,
      })),
      location: p.propertyLocations.map((loc) => ({
        id: loc.id,
        city: loc.city,
        street: loc.street,
      })),
      media: p.media?.map((m) => ({
        id: m.id,
        images: m.imagesUrl,
        videoUrl: m.videoUrl,
        virtualUrl: m.virtualTour,
        pdf: m.pdfUrl,
      })),
      features:p.features,
      detail:p.details,
      createdAt:p.createdAt
    }));
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ✅ Get single property by ID
  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: ['user', 'propertyTypes'],
    });
    if (!property) throw new NotFoundException(`Property ${id} not found`);
    return property;
  }

  // ✅ Update property only if owned by logged-in user
  async update(
    id: string,
    dto: UpdatePropertyDto,
    userId?: number,
  ): Promise<Property> {
    const property = await this.findOne(id);

    if (userId && property.user.id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }

    Object.assign(property, dto);
    return this.propertyRepo.save(property);
  }
  async findMyProperties(
    userId: number,
    { page, limit }: { page: number; limit: number },
  ): Promise<{ data: any[]; meta: any }> {
    // Optional: check if user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const [properties, total] = await this.propertyRepo.findAndCount({
      where: { user: { id: userId } },
      relations: ['propertyTypes', 'propertyLocations', 'media'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }, // optional: newest first
    });

    const data = properties.map((p) => ({
      id: p.id,
      purpose: p.purpose,
      purposeOption: p.purposeOption,
      isPublished: p.isPublished,
      propertyTypes: p.propertyTypes,
      propertyLocations: p.propertyLocations,
      media: p.media,
      details: p.details,
      features: p.features,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ✅ Delete property only if owned by logged-in user
  async remove(id: string, userId?: number): Promise<void> {
    const property = await this.findOne(id);

    if (userId && property.user.id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }

    const result = await this.propertyRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property ${id} not found`);
    }
  }
}
