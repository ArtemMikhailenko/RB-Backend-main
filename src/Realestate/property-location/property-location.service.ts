// src/property-location/property-location.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyLocation } from './entities/property-location.entity';
import { CreatePropertyLocationDto } from './dto/create-property-location.dto';
import { UpdatePropertyLocationDto } from './dto/update-property-location.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertyLocationService {
  constructor(
    @InjectRepository(PropertyLocation)
    private readonly locationRepo: Repository<PropertyLocation>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // Create location for a property
  async create(dto: CreatePropertyLocationDto, userId: number): Promise<PropertyLocation> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId) {
      throw new ForbiddenException('You cannot add location to this property');
    }

    const location = this.locationRepo.create({ ...dto, property });
    return this.locationRepo.save(location);
  }

  // Get all locations (admin/debug)
  async findAll(): Promise<PropertyLocation[]> {
    return this.locationRepo.find({ relations: ['property', 'property.user'] });
  }

  // Get all locations for logged-in user
  async findByUser(userId: number): Promise<PropertyLocation[]> {
    return this.locationRepo
      .createQueryBuilder('loc')
      .leftJoinAndSelect('loc.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // Get single location
  async findOne(id: string): Promise<PropertyLocation> {
    const loc = await this.locationRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!loc) throw new NotFoundException('Location not found');
    return loc;
  }

  // Update location
  async update(id: string, dto: UpdatePropertyLocationDto, userId: number): Promise<PropertyLocation> {
    const loc = await this.findOne(id);
    if (loc.property.user.id !== userId) {
      throw new ForbiddenException('You cannot update this location');
    }

    Object.assign(loc, dto);
    return this.locationRepo.save(loc);
  }

  // Delete location
  async remove(id: string, userId: number): Promise<{ message: string }> {
    const loc = await this.findOne(id);
    if (loc.property.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this location');
    }

    await this.locationRepo.remove(loc);
    return { message: 'PropertyLocation deleted successfully' };
  }
}
