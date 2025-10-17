// src/company-members/dto/update-company-role.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { CompanyRole } from '../entities/company-member.entity';

export class UpdateCompanyRoleDto {
  @IsOptional()
  @IsEnum(CompanyRole)
  role?: CompanyRole;
}
