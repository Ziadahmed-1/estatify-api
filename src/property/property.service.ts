import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { Property } from './entities/property.entity';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyImage } from './entities/property-image.entity'; // ← Import the image entity
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PropertyService {
  constructor(
    private readonly notificationService: NotificationService,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(PropertyImage)
    private readonly imageRepo: Repository<PropertyImage>,
  ) {}

  async getProperty(id: number) {
    try {
      const property = await this.propertyRepo.findOne({
        where: { id },
        relations: ['images'], // include images
      });

      if (!property) {
        throw new NotFoundException('Property not found');
      }

      return property;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getPublishedProperties() {
    try {
      const properties = await this.propertyRepo.find({
        where: { isPublished: true },
        relations: ['images'],
      });

      if (!properties || properties.length === 0) {
        throw new NotFoundException('Properties not found');
      }

      return properties;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getPendingProperties() {
    try {
      const properties = await this.propertyRepo.find({
        where: { isPublished: false },
        relations: ['images'],
      });

      if (!properties || properties.length === 0) {
        throw new NotFoundException('Properties not found');
      }

      return properties;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    user: { userId: number; role: string },
    imageFiles: Express.Multer.File[],
  ) {
    const isAdmin = user.role === 'admin';
    try {
      const property = this.propertyRepo.create({
        ...createPropertyDto,
        userId: user.userId,
        isPublished: isAdmin,
      });

      if (imageFiles?.length) {
        const images = imageFiles.map((file) => this.imageRepo.create({ data: file.buffer }));
        property.images = images;
      }

      const notificationMsg = isAdmin ? 'Property created' : 'Property submitted for approval';
      await this.notificationService.create(user.userId, notificationMsg);

      return await this.propertyRepo.save(property);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateProperty(id: number, updatePropertyDto: UpdatePropertyDto, newImages: Express.Multer.File[]) {
    try {
      const property = await this.getProperty(id);

      // Update property fields
      Object.assign(property, updatePropertyDto);
      property.updatedAt = new Date();

      // If new images uploaded, replace existing images
      if (newImages?.length) {
        // Remove existing images (optional)
        await this.imageRepo.delete({ property: { id } });

        // Create and attach new images
        const imageEntities = newImages.map((file) => this.imageRepo.create({ data: file.buffer, property }));
        property.images = imageEntities;
      }

      return await this.propertyRepo.save(property);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async approveProperty(id: number) {
    try {
      const property = await this.getProperty(id);
      property.isPublished = true;

      await this.notificationService.create(property.userId, 'Your property has been approved and published.');

      return await this.propertyRepo.save(property);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
