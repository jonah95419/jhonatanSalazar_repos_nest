import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { mergeMap, Observable, of } from 'rxjs';
import { CreatedOrganizationDto } from './dto/create-organization.dto';
import { GetAllOrganizationDto } from './dto/get-all-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly _organizationService: OrganizationService) {}

  @Get(':id_organization')
  getOrganizationById(
    @Param('id_organization', ParseIntPipe) id_organization: number,
  ): Observable<GetAllOrganizationDto> {
    return of(1).pipe(
      mergeMap(() => this._organizationService.getItemById(id_organization)),
    );
  }

  @Get()
  getOrganizations(): Observable<GetAllOrganizationDto[]> {
    return of(1).pipe(mergeMap(() => this._organizationService.getAllItems()));
  }

  @Post('created')
  createOrganization(
    @Body() organization: CreatedOrganizationDto,
  ): Observable<GetAllOrganizationDto> {
    return of(1).pipe(
      mergeMap(() => this._organizationService.createItem(organization)),
    );
  }

  @Patch(':id_organization')
  updateOrganization(
    @Param('id_organization', ParseIntPipe) id_organization: number,
    @Body() organization: UpdateOrganizationDto,
  ): Observable<GetAllOrganizationDto> {
    return of(1).pipe(
      mergeMap(() =>
        this._organizationService.updateItem(id_organization, organization),
      ),
    );
  }

  @Delete(':id_organization')
  deleteOrganizationById(
    @Param('id_organization', ParseIntPipe) id_organization: number,
  ): Observable<GetAllOrganizationDto[]> {
    return of(1).pipe(
      mergeMap(() => this._organizationService.deleteItemById(id_organization)),
    );
  }
}
