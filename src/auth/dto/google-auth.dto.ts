import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  provider?: string; // e.g., 'google'

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  profilePic?: string;
}
