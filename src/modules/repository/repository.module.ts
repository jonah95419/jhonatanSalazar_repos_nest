import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tribe } from '../tribe/tribe.entity';
import { RepositoryController } from './repository.controller';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Repository, Tribe])],
  providers: [RepositoryService],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
