import { IsNotEmpty, IsString } from 'class-validator';
import { Metric } from '../../metric/metric.entity';
import { Tribe } from '../../tribe/tribe.entity';

export class GetAllRepositoryDto {
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
