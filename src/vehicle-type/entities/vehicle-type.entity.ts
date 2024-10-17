import { Field, ObjectType } from '@nestjs/graphql';
import { Make } from '../../make/entities/make.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class VehicleType {
  @Field()
  @PrimaryGeneratedColumn()
  typeId: number;

  @Field()
  @Column()
  typeName: string;

  @Field(() => [Make], { nullable: true })
  @ManyToMany(() => Make, (make) => make.vehicleTypes)
  makes?: Make[];
}
