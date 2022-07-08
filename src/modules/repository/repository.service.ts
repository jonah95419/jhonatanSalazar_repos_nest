import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import { Repository as RepositoryOrm } from 'typeorm';
import { MessageValues } from '../../constants/MessageValues';
import { GetAllRepositoryDto } from './dto/get-all-repository.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { Observable, mergeMap, map, of, iif, throwError } from 'rxjs';
import { Tribe } from '../tribe/tribe.entity';
import { isEmpty, set, isUndefined } from 'lodash';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repository)
    private readonly _repositoryRepository: RepositoryOrm<Repository>,
    @InjectRepository(Tribe)
    private readonly _tribeRepository: RepositoryOrm<Tribe>,
  ) {}

  getItemById(id_repository: number): Observable<GetAllRepositoryDto> {
    return of(1).pipe(
      mergeMap(() =>
        this._repositoryRepository.findOne({
          id_repository,
        }),
      ),
      mergeMap((repository: Repository) =>
        iif(
          () => !isEmpty(repository),
          of(repository),
          this._catchErrorMessage(MessageValues.MESSAGE_R404),
        ),
      ),
      map((repository: Repository) =>
        plainToInstance(GetAllRepositoryDto, repository),
      ),
    );
  }

  getAllItems(): Observable<GetAllRepositoryDto[]> {
    return of(1).pipe(
      mergeMap(() => this._repositoryRepository.find()),
      map((repositories: Repository[]) =>
        plainToInstance(GetAllRepositoryDto, repositories),
      ),
    );
  }

  createItem(repository: CreateRepositoryDto): Observable<GetAllRepositoryDto> {
    return of(1).pipe(
      mergeMap(() => this._tribeRepository.findOne(repository.id_tribe)),
      mergeMap((tribe: Tribe) =>
        iif(
          () => !isEmpty(tribe),
          this._saveItemRepository(repository, tribe),
          this._catchErrorMessage(MessageValues.MESSAGE_T404),
        ),
      ),
      map((savedRepository: Repository) =>
        plainToInstance(GetAllRepositoryDto, savedRepository),
      ),
    );
  }

  updateItem(
    id_repository: number,
    repository: UpdateRepositoryDto,
  ): Observable<GetAllRepositoryDto> {
    return of(1).pipe(
      mergeMap(() =>
        this._repositoryRepository.findOne({
          id_repository,
        }),
      ),
      mergeMap((repositoryOld: Repository) =>
        iif(
          () => !isEmpty(repositoryOld),
          this._saveItemRepository({
            id_repository,
            ...repository,
          }),
          this._catchErrorMessage(MessageValues.MESSAGE_T404),
        ),
      ),
      map((updateRepository: Repository) =>
        plainToInstance(GetAllRepositoryDto, updateRepository),
      ),
    );
  }

  private _saveItemRepository(
    repository: CreateRepositoryDto | UpdateRepositoryDto,
    tribe?: Tribe,
  ): Observable<Repository> {
    return of(1).pipe(
      map(() => {
        !isUndefined(tribe) ? set(repository, 'tribe', tribe) : null;

        return repository;
      }),
      mergeMap((createRepository: CreateRepositoryDto) =>
        this._repositoryRepository.save(createRepository),
      ),
    );
  }

  private _catchErrorMessage(message: string): Observable<Error> {
    return throwError(() => new BadRequestException(message));
  }
}
