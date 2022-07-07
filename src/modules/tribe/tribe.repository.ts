import { EntityRepository, Repository } from 'typeorm';
import { Tribe } from './tribe.entity';

@EntityRepository(Tribe)
export class TribeRepository extends Repository<Tribe> {}
