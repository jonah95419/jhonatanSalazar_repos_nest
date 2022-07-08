import { IsNotEmpty, IsNumber } from 'class-validator';
import { Repository } from '../../repository/repository.entity';

export class GetAllMetricDto {
  @IsNotEmpty()
  @IsNumber()
  'id_repository': number;

  @IsNotEmpty()
  'repository': Repository;

  @IsNotEmpty()
  @IsNumber()
  'coverage': number;

  @IsNotEmpty()
  @IsNumber()
  'bugs': number;

  @IsNotEmpty()
  @IsNumber()
  'hotspot': number;

  @IsNotEmpty()
  @IsNumber()
  'code_smells': number;

  @IsNotEmpty()
  @IsNumber()
  'vulnerabilities': number;
}
