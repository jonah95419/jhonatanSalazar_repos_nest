import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';
import { Repository } from '../repository/repository.entity';

@Entity('metrics')
export class Metric {
  @PrimaryColumn()
  'id_repository': number;

  @OneToOne(() => Repository, (repository) => repository.metrics, {
    cascade: true,
  })
  @JoinColumn({ name: 'id_repository' })
  'repository': Repository;

  @Column({ type: 'integer' })
  'coverage': number;

  @Column({ type: 'integer' })
  'bugs': number;

  @Column({ type: 'integer' })
  'hotspot': number;

  @Column({ type: 'integer' })
  'code_smells': number;

  @Column({ type: 'integer' })
  'vulnerabilities': number;
}
