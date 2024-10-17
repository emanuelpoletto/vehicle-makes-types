import { ObjectType, Field } from '@nestjs/graphql';
import { PaginationOutput } from './pagination.interface';

@ObjectType()
export class Pagination implements PaginationOutput {
  @Field()
  skip: number;

  @Field()
  take: number;

  @Field()
  count: number;
}
