import { EntityRepository, Repository } from 'typeorm';
import { Metric } from './metric.entity';

@EntityRepository(Metric)
export class MetricRepository extends Repository<Metric> {}
