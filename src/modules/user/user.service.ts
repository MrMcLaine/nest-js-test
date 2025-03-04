import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '@auth/auth.service';
import { BcryptUtil } from '@common/utils/bcrypt.util';
import { User } from '@user/user.model';
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

    async findByEmailWithCheck(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });

        if (!user) throw new Error(`User with email ${email} not found`);

        return user;
    }

    async createUser(input: RegisterUserInput): Promise<AuthResponse> {
        const hashedPassword = await BcryptUtil.hashPassword(input.password);

        const user = await this.userRepository.save(
            toCreateUserData(hashedPassword, input)
        );

        return {
            user: toUserDto(user),
            token: this.authService.generateToken(toUserDto(user)),
        };
    }
}
