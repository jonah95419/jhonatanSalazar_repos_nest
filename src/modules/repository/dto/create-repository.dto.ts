import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRepositoryDto {
  @IsNotEmpty()
  @IsNumber()
  'id_tribe': number;

  @IsNotEmpty()
  @IsString()
  'name': string;

  @IsNotEmpty()
  @IsString()
  'state': string;

  @IsNotEmpty()
  @IsDateString()
  'createTime': Date;

  @IsNotEmpty()
  @IsString()
  'status': string;
}
