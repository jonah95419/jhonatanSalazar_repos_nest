import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllTribeDto } from './dto/get-all-tribe.dto';
import { Tribe } from './tribe.entity';
import { plainToInstance } from 'class-transformer';
import { CreateTribeDto } from './dto/create-tribe.dto';
import { iif, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { isEmpty, set } from 'lodash';
import { Organization } from '../organization/organization.entity';
import { MessageValues } from '../../constants/MessageValues';

@Injectable()
export class TribeService {
  constructor(
    @InjectRepository(Tribe)
    private readonly _tribeRepository: Repository<Tribe>,
    @InjectRepository(Organization)
    private readonly _organizationRepository: Repository<Organization>,
  ) {}

  getAllItems(): Observable<GetAllTribeDto[]> {
    return of(1).pipe(
      mergeMap(() => this._tribeRepository.find()),
      map((tribes: Tribe[]) => plainToInstance(GetAllTribeDto, tribes)),
    );
  }

  createItem(tribe: CreateTribeDto): Observable<GetAllTribeDto> {
    return of(1).pipe(
      mergeMap(() =>
        this._organizationRepository.findOne(tribe.id_organization),
      ),
      mergeMap((organization: Organization) =>
        iif(
          () => !isEmpty(organization),
          this._saveItemTribe(organization, tribe),
          this._catchErrorMessage(MessageValues.ORGANIZATION_EMPTY),
        ),
      ),
      map((savedTribe: GetAllTribeDto) =>
        plainToInstance(GetAllTribeDto, savedTribe),
      ),
    );
  }

  private _saveItemTribe(
    organization: Organization,
    tribe: CreateTribeDto,
  ): Observable<GetAllTribeDto> {
    return of(1).pipe(
      map(() => {
        set(tribe, 'organization', organization);

        return tribe;
      }),
      mergeMap((tribe: CreateTribeDto) => this._tribeRepository.save(tribe)),
    );
  }

  private _catchErrorMessage(message: string): Observable<Error> {
    return throwError(() => new BadRequestException(message));
  }
}
