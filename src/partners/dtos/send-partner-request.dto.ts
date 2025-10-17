import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SendPartnerRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}
