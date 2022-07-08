import { IsNotEmpty, IsString } from 'class-validator';
import { Metric } from '../../metric/metric.entity';
import { Tribe } from '../../tribe/tribe.entity';
import { Repository } from '../repository.entity';

export class GetAllRepositoryDto {
  @IsNotEmpty()
  'repository': Repository;

  @IsNotEmpty()
  'tribe': Tribe;

  @IsNotEmpty()
  'metrics': Metric[];

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
