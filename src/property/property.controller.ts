import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyService } from './property.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create property with optional image uploads',
    type: CreatePropertyDto,
  })
  createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: { userId: number; role: string },
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.propertyService.createProperty(createPropertyDto, user, files?.images || []);
  }

  @Post('approve/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  approveProperty(@Param('id') id: number) {
    return this.propertyService.approveProperty(id);
  }

  @Get(':id')
  getProperty(@Param('id') id: number) {
    return this.propertyService.getProperty(id);
  }

  @Get()
  getPublishedProperties(@Query('page') page: number = 1, @Query('count') count: number = 10) {
    return this.propertyService.getPublishedProperties(page, count);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getPendingProperties() {
    return this.propertyService.getPendingProperties();
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePropertyDto }) // for Swagger docs
  updateProperty(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.propertyService.updateProperty(id, updatePropertyDto, files?.images || []);
  }
}
