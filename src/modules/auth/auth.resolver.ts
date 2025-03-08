import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginAuthInput, AuthResponse, RegisterUserInput } from '@auth/dto';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse)
    async registerUser(
        @Args('data') data: RegisterUserInput
    ): Promise<AuthResponse> {
        return await this.authService.registerUser(data);
    }

    @Mutation(() => AuthResponse)
    async login(@Args('data') data: LoginAuthInput): Promise<AuthResponse> {
        return this.authService.login(data);
    }
}
