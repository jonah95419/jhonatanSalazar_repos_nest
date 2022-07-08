import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRepositoryDto {
  @IsNotEmpty()
  @IsNumber()
  'id_repository': number;

  @IsNotEmpty()
  @IsString()
  'name': string;

  @IsNotEmpty()
  @IsString()
  'state': string;

  @IsNotEmpty()
  'createTime': Date;

  @IsNotEmpty()
  @IsString()
  'status': string;
}
