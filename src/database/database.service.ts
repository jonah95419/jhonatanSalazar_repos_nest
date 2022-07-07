import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.keys';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { DataSourceOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      const dbUrl = new URL(config.get(Configuration.DATABASE_URL));
      const routingId = dbUrl.searchParams.get('options');
      dbUrl.searchParams.delete('options');

      return {
        ssl: true,
        type: Configuration.DATABASE_NAME,
        url: dbUrl.toString(),
        synchronize: true,
        migrationsRun: true,
        extra: {
          options: routingId,
        },
        dropSchema: false,
        entities: [`${__dirname}/../**/*.entity{.ts,.js]}`],
        migrations: [`${__dirname}/migrations/*{.ts,.js]}`],
      } as DataSourceOptions;
    },
  }),
];
