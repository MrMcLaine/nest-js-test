import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { buildUserData, transformUserToDto } from '@user/utils';
import { UserDto } from '@user/dto/user-dto';
import { convertToJwtPayload, BcryptUtil } from '@auth/utils';
import { AuthResponse, RegisterUserInput, LoginAuthInput } from '@auth/dto';
import {
    invalidEmailOrPassword,
    registerUserErrorTitle,
} from '@auth/constants/error-messages';

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
            throw new Error(`${registerUserErrorTitle}${error.message}`);
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
                throw new Error(invalidEmailOrPassword);
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
