import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TribeService } from './tribe.service';
import { TribeController } from './tribe.controller';
import { Tribe } from './tribe.entity';
import { Organization } from '../organization/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tribe, Organization])],
  providers: [TribeService],
  controllers: [TribeController],
})
export class TribeModule {}
