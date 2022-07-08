import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import { Repository as RepositoryOrm } from 'typeorm';
import { MessageValues } from '../../constants/MessageValues';
import { GetAllRepositoryDto } from './dto/get-all-repository.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import {
  Observable,
  mergeMap,
  map,
  of,
  iif,
  throwError,
  forkJoin,
  from,
  filter,
  reduce,
  concatMap,
} from 'rxjs';
import { Tribe } from '../tribe/tribe.entity';
import { isEmpty, get, set, isUndefined, isEqual } from 'lodash';
import { MetricsValues } from '../../constants/MetricsValues';
import {
  RepositoryEnum,
  RepositoryStateValueEnum,
  RepositoryValueEnum,
} from '../../constants/RepositoryEnums';

import axios from 'axios';
import { parseAsync } from 'json2csv';

import { RETENTION_CSV_FILE_COLUMNS_EMAIL } from '../../constants/FileColumnsValues';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repository)
    private readonly _repositoryRepository: RepositoryOrm<Repository>,
    @InjectRepository(Tribe)
    private readonly _tribeRepository: RepositoryOrm<Tribe>,
  ) {}

  getItemById(id_repository: number): Observable<GetAllRepositoryDto | Error> {
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

  getItemsByTribeId(
    id_tribe: number,
  ): Observable<GetAllRepositoryDto[] | object[] | Error> {
    return of(1).pipe(
      mergeMap(() => this._tribeRepository.findOne(id_tribe)),
      mergeMap((tribe: Tribe) =>
        iif(
          () => !isEmpty(tribe),
          of(tribe),
          this._catchErrorMessage(MessageValues.MESSAGE_T404),
        ),
      ),
      mergeMap(() =>
        this._repositoryRepository.find({ where: { tribe: { id_tribe } } }),
      ),
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

  generateReport(id_tribe: number): Observable<string> {
    return of(1).pipe(
      mergeMap(() => this._tribeRepository.findOne(id_tribe)),
      mergeMap((tribe: Tribe) =>
        iif(
          () => !isEmpty(tribe),
          of(tribe),
          this._catchErrorMessage(MessageValues.REPORT_EMPTY),
        ),
      ),
      mergeMap(() =>
        this._repositoryRepository.find({ where: { tribe: { id_tribe } } }),
      ),
      mergeMap((repositories: Repository[]) =>
        forkJoin([
          of(repositories),
          this._getValueStatusCode(),
          this._validateCoverageRepository(repositories),
        ]),
      ),
      mergeMap((response: [Repository[], object[], boolean]) =>
        iif(
          () => response[2],
          this._validateAndGenerateItemReport(response[0], response[1]),
          this._catchErrorMessage(MessageValues.COVERAGE_MINIMUM),
        ),
      ),
      mergeMap((dataReport: object[]) =>
        parseAsync(dataReport, {
          delimiter: '|',
          fields: RETENTION_CSV_FILE_COLUMNS_EMAIL,
          quote: '',
        }),
      ),
      map((csv: string) => Buffer.from(csv).toString()),
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

  private _validateCoverageRepository(data: Repository[]): Observable<boolean> {
    return from(data).pipe(
      filter((repository: Repository) => !isEmpty(get(repository, 'metrics'))),
      reduce((accumulator: Repository[], value: Repository) => {
        if (
          Number(get(value, 'metrics.coverage', 0)) >
          MetricsValues.COVERAGE_MINIMUM
        )
          accumulator.concat(value);

        return accumulator;
      }, []),
      map((repositories: Repository[]) => isEmpty(repositories)),
    );
  }

  private _getValueStatusCode(): Observable<object[]> {
    const mock_api_url: string = new ConfigService().get(
      Configuration.MOCK_API_URL,
    );

    return of(1).pipe(
      mergeMap(() => axios(mock_api_url)),
      map((response: object) => get(response, 'data.repositories', [])),
    );
  }

  private _validateAndGenerateItemReport(
    repositories: Repository[],
    codeValues: object[],
  ): Observable<object[]> {
    return of(1).pipe(
      mergeMap(() => from(repositories)),
      filter((repository: Repository) =>
        this._isCurrentYearAndStatusEnabled(repository),
      ),
      concatMap((response: Repository) =>
        this._buildDataToReport(response, codeValues),
      ),
      reduce(
        (accumulator: object[], value: object) => accumulator.concat(value),
        [],
      ),
    );
  }

  private _isCurrentYearAndStatusEnabled(repository: Repository): boolean {
    const state: string = get(repository, 'state', '');
    const created_date: string = get(repository, 'createTime', '');
    const current_year: number = new Date().getFullYear();
    const created_year: number = new Date(created_date).getFullYear();

    return (
      isEqual(state, RepositoryEnum.enable) &&
      isEqual(current_year, created_year)
    );
  }

  private _buildDataToReport(
    repository: Repository,
    valueCode: object[],
  ): Observable<object> {
    const id = Number(get(repository, 'id_repository', 0));
    const state_value: object = valueCode?.find(
      (state: object) => state['id'] === id,
    );
    const state: string = get(state_value, 'state', '');

    return of({
      id,
      name: get(repository, 'name', ''),
      tribe: get(repository, 'tribe.name', ''),
      organization: get(repository, 'tribe.organization.name', ''),
      coverage: `${get(repository, 'metrics.coverage', 0)}%`,
      codeSmells: Number(get(repository, 'metrics.code_smells', 0)),
      bugs: Number(get(repository, 'metrics.bugs', 0)),
      vulnerabilities: Number(get(repository, 'metrics.vulnerabilities', 0)),
      hotspots: Number(get(repository, 'metrics.hotspots', 0)),
      verificationState: RepositoryStateValueEnum[state],
      state: RepositoryValueEnum[RepositoryEnum.enable],
    });
  }

  private _catchErrorMessage(message: string): Observable<Error> {
    return throwError(() => new BadRequestException(message));
  }
}
