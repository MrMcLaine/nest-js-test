import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '@auth/auth.service';
import { BcryptUtil } from '@common/utils/bcrypt.util';
import { User } from '@user/user.entity';
import { toCreateUserData } from '@user/utils/toCreateUserData';
import { toUserDto } from '@user/utils/toUserDto';
import { RegisterUserInput } from '@user/dto/register-user.input';
import { AuthResponse } from '@user/dto/auth-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOneBy({ email });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async createUser(input: RegisterUserInput): Promise<AuthResponse> {
        try {
            const hashedPassword = await BcryptUtil.hashPassword(
                input.password
            );

            const user = await this.userRepository.save(
                toCreateUserData(hashedPassword, input)
            );

            return {
                user: toUserDto(user),
                token: this.authService.generateToken(toUserDto(user)),
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
}
