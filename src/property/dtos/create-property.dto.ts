import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  postingType: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  features: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  area: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  beds: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  baths: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
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
