import { EntityRepository, Repository as RepositoryOrm } from 'typeorm';
import { Repository } from './repository.entity';

@EntityRepository(Repository)
export class RepositoryRepository extends RepositoryOrm<Repository> {}
