import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryController } from '../repository.controller';
import { Repository } from '../repository.entity';
import { RepositoryService } from '../repository.service';
import { Repository as RepositoryOrm } from 'typeorm';
import { of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { GetAllRepositoryDto } from '../dto/get-all-repository.dto';
import { Tribe } from '../../tribe/tribe.entity';
import { MessageValues } from '../../../constants/MessageValues';
import { GetAllMetricDto } from '../../metric/dto/get-all-metric.dto';

describe('RepositoryService', () => {
  const config_connection: object = {
    ssl: true,
    type: 'cockroachdb',
    database: 'defaultdb',
    url: 'postgresql://jhonatan:cAaE4PmPr3CFnNpOvVgZHg@free-tier11.gcp-us-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
    synchronize: true,
    migrationsRun: true,
    extra: {
      options: '--cluster=rash-ray-1275',
    },
    entities: ['src/**/**/*.entity{.ts,.js]}'],
    migrations: ['src/database/migrations/*{.ts,.js]}'],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
  };
  let service: RepositoryService;
  let controller: RepositoryController;
  let repository: RepositoryOrm<Repository>;
  const metric: GetAllMetricDto = {
    id_repository: 1,
    repository: new Repository(),
    coverage: 76,
    bugs: 1,
    vulnerabilities: 5,
    code_smells: 9,
    hotspot: 1,
  };
  const itemRepository: GetAllRepositoryDto = {
    name: 'A test todo',
    state: 'E',
    status: 'I',
    tribe: new Tribe(),
    metrics: [
      { ...metric, coverage: 10 },
      { ...metric, coverage: 75 },
      { ...metric, coverage: 86 },
      { ...metric, coverage: 22 },
    ],
    createTime: new Date('2022-07-08T06:34:31.494Z'),
  };
  const listRepositories: GetAllRepositoryDto[] = plainToInstance(
    GetAllRepositoryDto,
    [itemRepository],
  );

  const mocked_repo = {
    findOne: jest.fn(() => Promise.resolve(itemRepository)),
    find: jest.fn(() => Promise.resolve(listRepositories)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config_connection),
        TypeOrmModule.forFeature([Repository, Tribe]),
      ],
      providers: [
        RepositoryService,
        {
          provide: getRepositoryToken(Repository),
          useValue: mocked_repo,
        },
      ],
      controllers: [RepositoryController],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
    controller = module.get<RepositoryController>(RepositoryController);
    repository = module.get(getRepositoryToken(Repository));
  });

  afterEach(() => jest.clearAllMocks());

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe.skip('When getRepositoryById is called - ', () => {
    it(' and return a list repositories', () => {
      const service_spy = jest
        .spyOn(service, 'getItemById')
        .mockReturnValue(of(itemRepository));

      const controller_spy = jest
        .spyOn(controller, 'getRepositoryById')
        .mockImplementation(() => of(itemRepository));

      controller.getRepositoryById(1).subscribe({
        complete: () => {
          expect(controller_spy).toHaveBeenCalledTimes(1);
          expect(controller_spy).toHaveBeenCalledWith(itemRepository);
          expect(service_spy).toHaveBeenCalledTimes(1);
          expect(service_spy).toHaveBeenCalledWith(itemRepository);
        },
        next: (response: GetAllRepositoryDto) => {
          expect(response).toEqual(itemRepository);
          expect(response).toBeInstanceOf(GetAllRepositoryDto);
        },
      });
    });

    it(' and not exist the repository and return message: El Repositorio no se encuentra registrado..', () => {
      const repository_spy = jest
        .spyOn(mocked_repo, 'findOne')
        .mockImplementation();

      const service_spy = jest
        .spyOn(service, 'getItemsByTribeId')
        .mockImplementation(() => of(new Error(MessageValues.MESSAGE_T404)));

      controller.getRepositoryById(1).subscribe({
        complete: () => {
          expect(mocked_repo.findOne).toHaveBeenCalledTimes(1);
          expect(repository_spy).toHaveBeenCalledWith([]);
          expect(service_spy).toHaveBeenCalledTimes(1);
          expect(service_spy).toHaveBeenCalledWith([]);
        },
        next: (response: GetAllRepositoryDto | Error) => {
          expect(response).toEqual(new Error(MessageValues.MESSAGE_T404));
          expect(response).toBeInstanceOf(Error);
        },
      });
    });
  });

  describe('When getRepositoryByTribeId is called - ', () => {
    it('scenario 1: coverage > 75%', () => {
      const service_spy = jest
        .spyOn(service, 'getItemsByTribeId')
        .mockReturnValue(of(listRepositories));

      const controller_spy = jest
        .spyOn(controller, 'getRepositoryByTribeId')
        .mockImplementation(() => of(listRepositories));

      controller.getRepositoryByTribeId(1).subscribe({
        complete: () => {
          expect(controller_spy).toHaveBeenCalledTimes(1);
          expect(controller_spy).toHaveBeenCalledWith(itemRepository);
          expect(service_spy).toHaveBeenCalledTimes(1);
          expect(service_spy).toHaveBeenCalledWith(itemRepository);
        },
        next: (response: GetAllRepositoryDto[]) => {
          expect(response.length).toEqual(2);
          expect(response).toBeInstanceOf(GetAllRepositoryDto);
        },
      });
    });

    it('scenario 2: La Tribu no se encuentra registrada.', () => {
      const repository_spy = jest
        .spyOn(mocked_repo, 'findOne')
        .mockImplementation();

      const service_spy = jest
        .spyOn(service, 'getItemsByTribeId')
        .mockImplementation(() => of(new Error(MessageValues.MESSAGE_T404)));

      controller.getRepositoryByTribeId(1).subscribe({
        complete: () => {
          expect(mocked_repo.findOne).toHaveBeenCalledTimes(1);
          expect(mocked_repo.find).toHaveBeenCalledTimes(0);
          expect(repository_spy).toHaveBeenCalledWith([]);
          expect(service_spy).toHaveBeenCalledTimes(1);
          expect(service_spy).toHaveBeenCalledWith([]);
        },
        next: (response: GetAllRepositoryDto[] | Error) => {
          expect(response).toEqual(new Error(MessageValues.MESSAGE_T404));
          expect(response).toBeInstanceOf(Error);
        },
      });
    });

    it('scenario 3: Información de verificación', () => {
      const listRepositoriesVerify: object[] = [
        {
          id: '2',
          name: 'cd-common-text',
          tribe: 'Centro Digital',
          organization: 'Banco Pichincha',
          coverage: '75%',
          codeSmells: 1,
          bugs: 0,
          vulnerabilities: 2,
          hotspots: 0,
          verificationState: 'En espera',
          state: 'Archivado',
        },
      ];
      const service_spy = jest
        .spyOn(service, 'getItemsByTribeId')
        .mockReturnValue(of(listRepositoriesVerify));

      jest
        .spyOn(mocked_repo, 'find')
        .mockImplementation(() => Promise.resolve(listRepositories));

      const controller_spy = jest
        .spyOn(controller, 'getRepositoryByTribeId')
        .mockImplementation(() => of(listRepositories));

      controller.getRepositoryByTribeId(1).subscribe({
        complete: () => {
          expect(controller_spy).toHaveBeenCalledTimes(1);
          expect(controller_spy).toHaveBeenCalledWith(listRepositories);
          expect(service_spy).toHaveBeenCalledTimes(1);
          expect(service_spy).toHaveBeenCalledWith(listRepositories);
        },
        next: (response: object[]) => {
          expect(response).toEqual(listRepositoriesVerify);
        },
      });
    });

    it('scenario 4: La Tribu no tiene repositorios que cumplan con la cobertura necesaria.', () => {
      const listRepositories = [
        {
          ...itemRepository,
          state: 'O',
          createTime: new Date('2020-07-08T06:34:31.494Z'),
          metrics: [
            { ...metric, coverage: 10 },
            { ...metric, coverage: 20 },
            { ...metric, coverage: 30 },
          ],
        },
      ];
      const repository_spy = jest
        .spyOn(mocked_repo, 'find')
        .mockImplementation(() => Promise.resolve(listRepositories));

      const service_spy = jest
        .spyOn(service, 'getItemsByTribeId')
        .mockImplementation(() => of(new Error(MessageValues.REPORT_EMPTY)));

      controller.getRepositoryByTribeId(1).subscribe({
        complete: () => {
          expect(mocked_repo.findOne).toHaveBeenCalledTimes(1);
          expect(mocked_repo.find).toHaveBeenCalledTimes(0);
          expect(repository_spy).toEqual([]);
          expect(service_spy).toHaveBeenCalledTimes(1);
          expect(service_spy).toEqual([]);
        },
        next: (response: GetAllRepositoryDto[] | Error) => {
          expect(response).toEqual(new Error(MessageValues.REPORT_EMPTY));
          expect(response).toBeInstanceOf(Error);
        },
      });
    });
  });
});
