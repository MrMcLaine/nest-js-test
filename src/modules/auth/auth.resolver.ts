import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { LoginAuthInput } from '@auth/dto/login-auth.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse)
    async login(@Args('data') data: LoginAuthInput): Promise<AuthResponse> {
        return this.authService.login(data);
    }
}
