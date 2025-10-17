import { IsDateString, IsNumber, isString, IsString ,IsUUID} from 'class-validator';

export class CreateNewBuildingDetailsDto {

  @IsUUID()
  propertyId:string;
  @IsString()
  reference: string;

  @IsNumber()
  price: number;

  @IsDateString()
  deliveryDate: string; // store as string, will map to Date in entity

  @IsString()
  stage: string;
}
