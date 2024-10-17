import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MakeService } from './make.service';
import { Make, MakesResponse } from './entities/make.entity';

@Resolver(() => MakesResponse)
export class MakeResolver {
  constructor(private readonly makeService: MakeService) {}

  @Query(() => MakesResponse)
  getMakes(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.makeService.findAll({ skip, take });
  }

  @Query(() => Make)
  getMake(@Args('id', { type: () => Int }) id: number) {
    return this.makeService.findOneById(+id);
  }
}
