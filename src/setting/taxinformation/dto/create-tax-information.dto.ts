import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaxInformationDto {
  @IsString()
@IsOptional()
  companyName: string;

  @IsString()
  @IsOptional()
  taxId: string; // Tax ID / VAT Number

  @IsString()
  @IsOptional()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
@IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  zipCode: string;

  @IsString()
  @IsOptional()
  country: string;
}
