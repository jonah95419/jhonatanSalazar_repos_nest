import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository as RepositoryOrm } from 'typeorm';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetAllMetricDto } from './dto/get-all-metric.dto';
import { Metric } from './metric.entity';
import { Observable, of, mergeMap, map, throwError, iif } from 'rxjs';
import { Repository } from '../repository/repository.entity';
import { isEmpty } from 'lodash';
import { MessageValues } from '../../constants/MessageValues';

@Injectable()
export class MetricService {
  constructor(
    @InjectRepository(Metric)
    private readonly _metricRepository: RepositoryOrm<Metric>,
    @InjectRepository(Repository)
    private readonly _repositoryRepository: RepositoryOrm<Repository>,
  ) {}

  getAllItems(): Observable<GetAllMetricDto[]> {
    return of(1).pipe(
      mergeMap(() => this._metricRepository.find()),
      map((metrics: Metric[]) => plainToInstance(GetAllMetricDto, metrics)),
    );
  }

  createItem(metric: CreateMetricDto): Observable<GetAllMetricDto> {
    return of(1).pipe(
      mergeMap(() =>
        this._repositoryRepository.findOne({
          id_repository: metric.id_repository,
        }),
      ),
      mergeMap((repository: Repository) =>
        iif(
          () => !isEmpty(repository),
          this._metricRepository.save(metric),
          this._catchErrorMessage(MessageValues.MESSAGE_R404),
        ),
      ),
      map((savedMetric: Metric) =>
        plainToInstance(GetAllMetricDto, savedMetric),
      ),
    );
  }

  private _catchErrorMessage(message: string): Observable<Error> {
    return throwError(() => new BadRequestException(message));
  }
}
