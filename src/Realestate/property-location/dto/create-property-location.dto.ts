import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePropertyLocationDto {
  @IsString()
  propertyId: string; // parent property

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  door?: string;

  @IsString()
  zipcode: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsNumber({}, { message: "latitude must be a number" })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: "latitude must be a number" })
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  showExactLocation?: boolean;
}
