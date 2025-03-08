import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptUtil } from '@common/utils/bcrypt.util';
import { UserService } from '@user/user.service';
import { UserDto } from '@user/dto/user-dto';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { transformUserToDto } from '@user/utils/transformUserToDto';
import { convertToJwtPayload } from '@auth/utils/convertToJwtPayload';
import { LoginAuthInput } from '@auth/dto/login-auth.input';
import { buildUserData } from '@user/utils/buildUserData';
import { RegisterUserInput } from '@user/dto/register-user.input';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    generateToken(user: UserDto): string {
        return this.jwtService.sign(convertToJwtPayload(user));
    }

    async registerUser(input: RegisterUserInput): Promise<AuthResponse> {
        try {
            const hashedPassword = await BcryptUtil.hashPassword(
                input.password
            );

            const userData = buildUserData(hashedPassword, input);
            const userDto = await this.userService.createUser(userData);

            return {
                user: userDto,
                token: this.generateToken(userDto),
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async login(input: LoginAuthInput): Promise<AuthResponse> {
        try {
            const user = await this.userService.findByEmail(input.email);

            if (
                !user ||
                !(await BcryptUtil.comparePasswords(
                    input.password,
                    user.password
                ))
            ) {
                throw new Error('Invalid email or password');
            }

            const userDto = transformUserToDto(user);

            return {
                user: userDto,
                token: this.generateToken(userDto),
            };
        } catch (error) {
            throw new Error(`Failed to login: ${error.message}`);
        }
    }
}
