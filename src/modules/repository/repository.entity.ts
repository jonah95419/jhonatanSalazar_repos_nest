import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Metric } from '../metric/metric.entity';
import { Tribe } from '../tribe/tribe.entity';

@Entity('repositories')
export class Repository extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  'id_repository': number;

  @ManyToOne(() => Tribe, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_tribe' })
  'tribe': Tribe;

  @OneToOne(() => Metric, (metrics) => metrics.repository, { eager: true })
  'metrics': Metric[];

  @Column({
    length: 50,
    type: 'char',
  })
  'name': string;

  @Column({
    length: 1,
    type: 'char',
  })
  'state': string;

  @Column({
    type: 'timestamp',
  })
  'create_time': Date;

  @Column({
    length: 1,
    type: 'char',
  })
  'status': string;
}
