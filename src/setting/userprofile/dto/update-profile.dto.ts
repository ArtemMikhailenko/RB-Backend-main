import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProfileDto } from './create-userprofile.dto';

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
