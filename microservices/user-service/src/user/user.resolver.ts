import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserType } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserCommand } from './commands/create-user.command';
import { GetUserQuery } from './queries/get-user.query';
import { GetUsersQuery } from './queries/get-users.query';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserDto): Promise<UserType> {
    return this.commandBus.execute(
      new CreateUserCommand(
        input.email,
        input.password,
        input.firstName,
        input.lastName,
      ),
    );
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<UserType | null> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Query(() => [UserType])
  async users(
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('offset', { type: () => Number, nullable: true }) offset?: number,
  ): Promise<UserType[]> {
    return this.queryBus.execute(new GetUsersQuery(limit, offset));
  }
}
