// src/Realestate/rent-contact/rent-contact.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentContact } from './entities/rent-contact.entity';
import { CreateRentContactDto } from './dto/create-rent-contact.dto';
import { UpdateRentContactDto } from './dto/update-rent-contact.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class RentContactService {
  constructor(
    @InjectRepository(RentContact)
    private readonly rentRepo: Repository<RentContact>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ✅ Create RentContact (ownership check via property.user)
  async create(
    dto: CreateRentContactDto,
    userId: number,
  ): Promise<{message: string}> {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('Property not found');

    if (property.user.id !== userId)
      throw new ForbiddenException('You cannot add Contact to this property');

    const contact = this.rentRepo.create({ ...dto, property });
    await this.rentRepo.save(contact);
     return { message: 'Contact created successfully' };
  }

  // ✅ Get all RentContacts (public)
  async findAll(): Promise<RentContact[]> {
    return this.rentRepo.find({
      relations: ['property', 'property.user'],
    });
  }

  // ✅ Get RentContacts for a specific user
  async findByUser(userId: number): Promise<RentContact[]> {
    return this.rentRepo
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.property', 'property')
      .leftJoinAndSelect('property.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ✅ Get single RentContact (public)
  async findOne(id: string): Promise<RentContact> {
    const contact = await this.rentRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!contact) throw new NotFoundException('Rent contact not found');
    return contact;
  }

  // ✅ Update RentContact (ownership check)
  async update(
    id: string,
    dto: UpdateRentContactDto,
    userId: number,
  ): Promise<RentContact> {
    const contact = await this.findOne(id);
    if (contact.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this Contact');

    Object.assign(contact, dto);
    return this.rentRepo.save(contact);
  }

  // ✅ Delete RentContact (ownership check)
  async remove(id: string, userId: number): Promise<{ message: string }> {
    const contact = await this.findOne(id);
    if (contact.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this Contact');

    await this.rentRepo.remove(contact);
    return { message: 'Contact deleted successfully' };
  }
}
