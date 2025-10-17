import { IsString, IsNumberString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNumberString()
  otp: string; 

  @IsString()
  @MinLength(6)
  newPassword: string;
}
