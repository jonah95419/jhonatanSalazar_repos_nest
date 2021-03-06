import { Module } from '@nestjs/common';
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
    OrganizationModule,
    TribeModule,
    RepositoryModule,
    MetricModule,
  ],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
