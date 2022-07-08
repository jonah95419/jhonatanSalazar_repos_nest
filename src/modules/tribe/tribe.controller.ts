import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTribeDto } from './dto/create-tribe.dto';
import { GetAllTribeDto } from './dto/get-all-tribe.dto';
import { TribeService } from './tribe.service';
import { Observable, mergeMap, of } from 'rxjs';

@Controller('tribes')
export class TribeController {
  constructor(private readonly _tribeService: TribeService) {}

  @Get()
  getTribes(): Observable<GetAllTribeDto[]> {
    return of(1).pipe(mergeMap(() => this._tribeService.getAllItems()));
  }

  @Post('created')
  createTribe(@Body() tribe: CreateTribeDto): Observable<GetAllTribeDto> {
    return of(1).pipe(mergeMap(() => this._tribeService.createItem(tribe)));
  }
}
