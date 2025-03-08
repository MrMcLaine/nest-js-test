import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptUtil } from '@common/utils';
import { UserService } from '@user/user.service';
import { buildUserData, transformUserToDto } from '@user/utils';
import { UserDto } from '@user/dto/user-dto';
import { convertToJwtPayload } from '@auth/utils';
import { AuthResponse, RegisterUserInput, LoginAuthInput } from '@auth/dto';

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
