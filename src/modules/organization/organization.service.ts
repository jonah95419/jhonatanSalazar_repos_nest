import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MessageValues } from '../../constants/MessageValues';
import { Organization } from './organization.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { GetAllOrganizationDto } from './dto/get-all-organization.dto';
import { CreatedOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { iif, mergeMap, Observable, of, map, throwError } from 'rxjs';
import { isEmpty } from 'lodash';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly _organizationRepository: Repository<Organization>,
  ) {}

  getItemById(id_organization: number): Observable<GetAllOrganizationDto> {
    return of(1).pipe(
      mergeMap(() => this._organizationRepository.findOne(id_organization)),
      mergeMap((organizationOld: Organization) =>
        iif(
          () => !isEmpty(organizationOld),
          of(organizationOld),
          this._catchErrorMessage(MessageValues.ORGANIZATION_EMPTY),
        ),
      ),
      mergeMap((organization: Organization) =>
        of(plainToInstance(GetAllOrganizationDto, organization)),
      ),
    );
  }

  getAllItems(): Observable<GetAllOrganizationDto[]> {
    return of(1).pipe(
      mergeMap(() => this._organizationRepository.find()),
      map((organizations: Organization[]) =>
        plainToInstance(GetAllOrganizationDto, organizations),
      ),
    );
  }

  createItem(
    organization: CreatedOrganizationDto,
  ): Observable<GetAllOrganizationDto> {
    return of(1).pipe(
      mergeMap(() => this._organizationRepository.save(organization)),
      map((savedOrganization: Organization) =>
        plainToInstance(GetAllOrganizationDto, savedOrganization),
      ),
    );
  }

  updateItem(
    id_organization: number,
    organization: UpdateOrganizationDto,
  ): Observable<GetAllOrganizationDto> {
    return of(1).pipe(
      mergeMap(() => this.getItemById(id_organization)),
      mergeMap((organizationOld: Organization) =>
        iif(
          () => !isEmpty(organizationOld),
          this._organizationRepository.save({
            id_organization,
            ...organization,
          }),
          this._catchErrorMessage(MessageValues.ORGANIZATION_EMPTY),
        ),
      ),
      map((updateOrganization: Organization) =>
        plainToInstance(GetAllOrganizationDto, updateOrganization),
      ),
    );
  }

  deleteItemById(id_organization: number): Observable<GetAllOrganizationDto[]> {
    return of(1).pipe(
      mergeMap(() => this._organizationRepository.findOne({ id_organization })),
      mergeMap((organization: Organization) =>
        iif(
          () => !isEmpty(organization),
          this._organizationRepository.remove(organization),
          this._catchErrorMessage(MessageValues.ORGANIZATION_EMPTY),
        ),
      ),
      mergeMap(() => this.getAllItems()),
      map((organizations: Organization[]) =>
        plainToInstance(GetAllOrganizationDto, organizations),
      ),
    );
  }

  private _catchErrorMessage(message: string): Observable<Error> {
    return throwError(() => new BadRequestException(message));
  }
}
