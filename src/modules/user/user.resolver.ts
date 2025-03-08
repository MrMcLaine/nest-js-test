import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { AuthResponse } from '@user/dto/auth-response.dto';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => AuthResponse)
    async registerUser(
        @Args('data') data: RegisterUserInput
    ): Promise<AuthResponse> {
        return await this.userService.createUser(data);
    }
}
