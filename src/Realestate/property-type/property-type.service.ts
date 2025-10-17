// src/property-type/property-type.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyType } from './entities/property-type.entity';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepo: Repository<PropertyType>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // Create a PropertyType for a given property
async create(dto: CreatePropertyTypeDto, userId: number): Promise<{id: string;
  propertyType: string;
  category: string;
  tags: string[]}> {
  // Fetch the parent property
  const property = await this.propertyRepo.findOne({
    where: { id: dto.propertyId },
    relations: ['user'],
  });
  if (!property) throw new NotFoundException('Property not found');

  // Optional: check that logged-in user owns this property
  if (property.user.id !== userId) {
    throw new ForbiddenException('You cannot add PropertyType to this property');
  }

  // Create PropertyType
  const propType = this.propertyTypeRepo.create({ ...dto, property });
  const savedPropType = await this.propertyTypeRepo.save(propType);
  return{
    id: savedPropType.id,
    propertyType: savedPropType.propertyType,
    category: savedPropType.category,
    tags: savedPropType.tags,
  }
}


  // Get all PropertyTypes
  async findAll(): Promise<PropertyType[]> {
    return this.propertyTypeRepo.find({ relations: ['property', 'property.user'] });
  }

  // Get PropertyTypes by user (via property owner)
// FIX: make userId a number
async findByUser(userId: number): Promise<PropertyType[]> {
  return this.propertyTypeRepo
    .createQueryBuilder('pt')
    .leftJoinAndSelect('pt.property', 'property')
    .leftJoinAndSelect('property.user', 'user')
    .where('user.id = :userId', { userId })
    .getMany();
}


  // Get single PropertyType
  async findOne(id: string): Promise<PropertyType> {
    const propType = await this.propertyTypeRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!propType) throw new NotFoundException('PropertyType not found');
    return propType;
  }

  // Update PropertyType (ownership check)
  async update(id: string, updateDto: UpdatePropertyTypeDto, userId: number): Promise<PropertyType> {
    const propType = await this.findOne(id);
    if (propType.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this PropertyType');

    Object.assign(propType, updateDto);
    return this.propertyTypeRepo.save(propType);
  }

  // Delete PropertyType (ownership check)
  async remove(id: string, userId:number): Promise<{ message: string }> {
    const propType = await this.findOne(id);
    if (propType.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this PropertyType');

    await this.propertyTypeRepo.remove(propType);
     return { message: 'PropertyType deleted successfully' };
  }
}
