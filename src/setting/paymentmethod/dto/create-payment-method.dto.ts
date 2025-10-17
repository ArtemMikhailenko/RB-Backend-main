import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  type: string; // e.g., 'Visa', 'Mastercard', 'PayPal'

  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  last4: string; // last 4 digits

  @IsOptional()
  @IsString()
  providerLogoUrl?: string;

  @IsOptional()
  @IsString()
  billingName?: string;

  @IsOptional()
  @IsString()
  billingEmail?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
