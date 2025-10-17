import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyMedia } from './entities/property-media.entity';
import { CreatePropertyMediaWithFilesDto } from './dto/create-property-media-with-files.dto';
import { MediaType } from './dto/media-type.enum';
import { UpdatePropertyMediaDto } from './dto/update-property-media.dto';
import { Property } from 'src/Realestate/property/entities/property.entity';

@Injectable()
export class PropertyMediaService {
  constructor(
    @InjectRepository(PropertyMedia)
    private readonly propertyMediaRepo: Repository<PropertyMedia>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}


async createWithFilesAndUrls(
  dto: CreatePropertyMediaWithFilesDto,
  files: { images?: Express.Multer.File[]; pdfs?: Express.Multer.File[] },
  userId: number,
): Promise<{ message: string }> {
  // 1. Check property + ownership
  const property = await this.propertyRepo.findOne({
    where: { id: dto.propertyId },
    relations: ['user'],
  });

  if (!property) throw new NotFoundException('Property not found');
  if (property.user.id !== userId)
    throw new ForbiddenException('You cannot add media to this property');

  // 2. Fetch existing PropertyMedia row or create new
  let propertyMedia = await this.propertyMediaRepo.findOne({
    where: { propertyId: dto.propertyId },
  });

  if (!propertyMedia) {
    propertyMedia = this.propertyMediaRepo.create({ propertyId: dto.propertyId });
  }

  // 3. Update video / virtualTour
  if (dto.videoUrl) propertyMedia.videoUrl = dto.videoUrl;
  if (dto.virtualTour) propertyMedia.virtualTour = dto.virtualTour;

  // 4. Merge images
  if (files.images?.length) {
    const newImages = files.images.map(file => `/uploads/property-media/${file.filename}`);
    propertyMedia.images = [...(propertyMedia.images || []), ...newImages];
  }

  // 5. Merge PDFs
  if (files.pdfs?.length) {
    const newPdfs = files.pdfs.map(file => `/uploads/property-media/${file.filename}`);
    propertyMedia.pdfs = [...(propertyMedia.pdfs || []), ...newPdfs];
  }

  // 6. Save single row
  await this.propertyMediaRepo.save(propertyMedia);
  return { message: 'Property media updated successfully' };
}



  // ✅ Create a single media
  // async create(
  //   dto: CreatePropertyMediaDto,
  //   userId: number,
  // ): Promise<PropertyMedia> {
  //   const property = await this.propertyRepo.findOne({
  //     where: { id: dto.propertyId },
  //     relations: ['user'],
  //   });

  //   if (!property) throw new NotFoundException('Property not found');
  //   if (property.user.id !== userId)
  //     throw new ForbiddenException('You cannot add media to this property');

  //   const media = this.propertyMediaRepo.create({ ...dto, property });
  //   return this.propertyMediaRepo.save(media);
  // }

  // ✅ Create multiple media at once
  // async createBatch(
  //   dtos: CreatePropertyMediaDto[],
  //   userId: number,
  // ): Promise<PropertyMedia[]> {
  //   if (!dtos || dtos.length === 0)
  //     throw new NotFoundException('No media items provided');

  //   const savedMedia: PropertyMedia[] = [];

  //   for (const dto of dtos) {
  //     const property = await this.propertyRepo.findOne({
  //       where: { id: dto.propertyId },
  //       relations: ['user'],
  //     });

  //     if (!property) throw new NotFoundException(`Property ${dto.propertyId} not found`);
  //     if (property.user.id !== userId)
  //       throw new ForbiddenException(`You cannot add media to property ${dto.propertyId}`);

  //     const media = this.propertyMediaRepo.create({ ...dto, property });
  //     savedMedia.push(await this.propertyMediaRepo.save(media));
  //   }

  //   return savedMedia;
  // }

  // ✅ Get all media
  async findAll(): Promise<PropertyMedia[]> {
    return this.propertyMediaRepo.find({
      relations: ['property', 'property.user'],
    });
  }

  // ✅ Get single media
  async findOne(id: string): Promise<PropertyMedia> {
    const media = await this.propertyMediaRepo.findOne({
      where: { id },
      relations: ['property', 'property.user'],
    });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  // ✅ Update media
  async update(
    id: string,
    dto: UpdatePropertyMediaDto,
    userId: number,
  ): Promise<PropertyMedia> {
    const media = await this.findOne(id);
    if (media.property.user.id !== userId)
      throw new ForbiddenException('You cannot update this media');

    Object.assign(media, dto);
    return this.propertyMediaRepo.save(media);
  }

  // ✅ Delete media
  async remove(id: string, userId: number): Promise<{ message: string }> {
    const media = await this.findOne(id);
    if (media.property.user.id !== userId)
      throw new ForbiddenException('You cannot delete this media');

    await this.propertyMediaRepo.remove(media);
    return { message: 'PropertyMedia deleted successfully' };
  }
}
