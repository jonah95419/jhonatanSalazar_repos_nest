import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TribeRepository } from './tribe.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TribeRepository])],
})
export class TribeModule {}
