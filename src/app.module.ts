import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config.keys';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { MetricModule } from './modules/metric/metric.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { TribeModule } from './modules/tribe/tribe.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     const dbUrl = new URL(config.get(Configuration.DATABASE_URL));
    //     const routingId = dbUrl.searchParams.get('options');
    //     dbUrl.searchParams.delete('options');

    //     return {
    //       ssl: true,
    //       type: config.get(Configuration.DATABASE) as 'cockroachdb',
    //       url: dbUrl.toString(),
    //       synchronize: false,
    //       migrationsRun: true,
    //       extra: {
    //         options: routingId,
    //       },
    //       autoLoadEntities: true,
    //       dropSchema: false,
    //       entities: [__dirname + '/../**/*.entity.{js}'],
    //       migrations: [__dirname + '/migrations/*{.ts,.js}'],
    //     } as TypeOrmModuleOptions;
    //   },
    // }),
    OrganizationModule,
    TribeModule,
    RepositoryModule,
    MetricModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
