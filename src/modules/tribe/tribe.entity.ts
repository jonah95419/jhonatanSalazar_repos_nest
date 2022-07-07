import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from '../organization/organization.entity';
import { Repository } from '../repository/repository.entity';

@Entity('tribes')
export class Tribe extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  'id_tribe': number;

  @ManyToOne(() => Organization, (organization) => organization.tribu, {
    eager: true,
  })
  'organization': Organization;

  @OneToMany(() => Repository, (repository) => repository.tribe, {
    eager: false,
  })
  'repository': Repository[];

  @Column({
    length: 50,
    type: 'char',
  })
  'name': string;

  @Column({ type: 'integer' })
  'status': number;
}
