import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMetricDto {
  @IsNotEmpty()
  @IsNumber()
  'id_repository': number;

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
