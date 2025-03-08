import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptUtil } from '@common/utils/bcrypt.util';
import { UserService } from '@user/user.service';
import { UserDto } from '@user/dto/user-dto';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { toUserDto } from '@user/utils/toUserDto';
import { toJwtPayload } from '@auth/utils/toJwtPayload';
import { LoginAuthInput } from '@auth/dto/login-auth.input';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) {}

    generateToken(user: UserDto): string {
        return this.jwtService.sign(toJwtPayload(user));
    }

    async login(input: LoginAuthInput): Promise<AuthResponse> {
        const user = await this.userService.findByEmail(input.email);

        if (
            !user ||
            !(await BcryptUtil.comparePasswords(input.password, user.password))
        ) {
            throw new Error('Invalid email or password');
        }

        const userDto = toUserDto(user);

        return {
            user: userDto,
            token: this.generateToken(userDto),
        };
    }
}
