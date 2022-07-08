import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetAllMetricDto } from './dto/get-all-metric.dto';
import { MetricService } from './metric.service';
import { Observable, mergeMap, of } from 'rxjs';

@Controller('metrics')
export class MetricController {
  constructor(private readonly _metricService: MetricService) {}

  @Get()
  getMetrics(): Observable<GetAllMetricDto[]> {
    return of(1).pipe(mergeMap(() => this._metricService.getAllItems()));
  }

  @Post('created')
  createMetric(@Body() metric: CreateMetricDto): Observable<GetAllMetricDto> {
    return of(1).pipe(mergeMap(() => this._metricService.createItem(metric)));
  }
}
