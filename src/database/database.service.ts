import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organization } from '../modules/organization/organization.entity';
import { Configuration } from '../config/config.keys';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

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
        type: config.get(Configuration.DATABASE) as 'cockroachdb',
        url: dbUrl.toString(),
        synchronize: false,
        migrationsRun: true,
        extra: {
          options: routingId,
        },
        autoLoadEntities: true,
        dropSchema: false,
        entities: [Organization],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as TypeOrmModuleOptions;
    },
  }),
];
