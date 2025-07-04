import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, MinLength } from 'class-validator';

export class UpdatePropertyDto {
  @ApiProperty()
  @MinLength(3)
  @IsOptional()
  title: string;

  @ApiProperty()
  @MinLength(20)
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  postingType: string;

  @ApiProperty()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsOptional()
  features: string[];

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  area: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  beds: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  baths: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude: number;

  // @ApiPropertyOptional()
  // @IsOptional()
  // images: Buffer[];
}
