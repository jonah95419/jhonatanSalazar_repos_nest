import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryRepository } from './repository.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryRepository])],
})
export class RepositoryModule {}
