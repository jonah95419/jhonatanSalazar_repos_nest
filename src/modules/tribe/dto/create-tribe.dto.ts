import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTribeDto {
  @IsNotEmpty()
  @IsNumber()
  id_organization: number;

  @IsNotEmpty()
  @IsString()
  'name': string;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
