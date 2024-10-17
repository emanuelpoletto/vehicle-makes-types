import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from '../../pagination/pagination.class';
import { VehicleType } from '../../vehicle-type/entities/vehicle-type.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Make {
  @Field()
  @PrimaryGeneratedColumn()
  makeId: number;

  @Field()
  @Column()
  makeName: string;

  @Field(() => [VehicleType], { nullable: true })
  @ManyToMany(() => VehicleType, (vehicleType) => vehicleType.makes)
  @JoinTable()
  vehicleTypes?: VehicleType[];
}

@ObjectType()
export class MakesResponse {
  @Field(() => [Make])
  makes: Make[];

  @Field(() => Pagination)
  pagination: Pagination;
}
