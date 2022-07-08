import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Organization } from '../../organization/organization.entity';
import { Repository } from '../../repository/repository.entity';

export class GetAllTribeDto {
  @IsNotEmpty()
  organization: Organization;

  @IsNotEmpty()
  repository: Repository[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
