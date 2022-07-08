import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from '../repository/repository.entity';
import { MetricController } from './metric.controller';
import { Metric } from './metric.entity';
import { MetricService } from './metric.service';

@Module({
  imports: [TypeOrmModule.forFeature([Metric, Repository])],
  providers: [MetricService],
  controllers: [MetricController],
})
export class MetricModule {}
