import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { UserDto } from './dto/user-dto';

@Resolver(() => UserDto)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => String)
    sayHello(): string {
        return 'Hello, GraphQL!';
    }

    @Mutation(() => UserDto)
    registerUser(@Args('data') data: RegisterUserInput): UserDto {
        return this.userService.createUser(data);
    }
}
