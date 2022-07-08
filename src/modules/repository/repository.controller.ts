import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { GetAllRepositoryDto } from './dto/get-all-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { RepositoryService } from './repository.service';
import { Observable, mergeMap, of } from 'rxjs';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly _repositoryService: RepositoryService) {}

  @Get(':id_repository')
  getRepositoryById(
    @Param('id_repository', ParseIntPipe) id_repository: number,
  ): Observable<GetAllRepositoryDto | Error> {
    return of(1).pipe(
      mergeMap(() => this._repositoryService.getItemById(id_repository)),
    );
  }

  @Get('tribe/:id_tribe')
  getRepositoryByTribeId(
    @Param('id_tribe', ParseIntPipe) id_tribe: number,
  ): Observable<GetAllRepositoryDto[] | object[] | Error> {
    return of(1).pipe(
      mergeMap(() => this._repositoryService.getItemsByTribeId(id_tribe)),
    );
  }

  @Get()
  getRepositories(): Observable<GetAllRepositoryDto[]> {
    return of(1).pipe(mergeMap(() => this._repositoryService.getAllItems()));
  }

  @Post('created')
  createRepository(
    @Body() repository: CreateRepositoryDto,
  ): Observable<GetAllRepositoryDto> {
    return of(1).pipe(
      mergeMap(() => this._repositoryService.createItem(repository)),
    );
  }

  @Patch(':id_repository')
  updateRepository(
    @Param('id_repository', ParseIntPipe) id_repository: number,
    @Body() repository: UpdateRepositoryDto,
  ): Observable<GetAllRepositoryDto> {
    return of(1).pipe(
      mergeMap(() =>
        this._repositoryService.updateItem(id_repository, repository),
      ),
    );
  }

  @Get('report/:id_tribe')
  getReportRepository(
    @Param('id_tribe', ParseIntPipe) id_tribe: number,
  ): Observable<string> {
    return of(1).pipe(
      mergeMap(() => this._repositoryService.generateReport(id_tribe)),
    );
  }
}
