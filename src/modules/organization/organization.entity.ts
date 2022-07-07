import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tribe } from '../tribe/tribe.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  'id_organization': number;

  @Column({
    length: 50,
    type: 'char',
  })
  'name': string;

  @Column({ type: 'integer' })
  'status': number;

  @OneToMany(() => Tribe, (tribe) => tribe.organization)
  'tribu': Tribe[];
}
