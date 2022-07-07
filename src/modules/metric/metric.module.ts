import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricRepository } from './metric.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MetricRepository])],
})
export class MetricModule {}
