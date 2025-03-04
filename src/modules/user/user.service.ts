import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/user.model';
import { BcryptUtil } from '@user/utils/bcrypt.util';
import { toCreateUserData } from '@user/utils/toCreateUserData';
import { toUserDto } from '@user/utils/toUserDto';
import { RegisterUserInput } from '@user/dto/register-user.input';
import { AuthResponse } from '@user/dto/auth-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(input: RegisterUserInput): Promise<AuthResponse> {
        const hashedPassword = await BcryptUtil.hashPassword(input.password);

        const user = await this.userRepository.save(
            toCreateUserData(hashedPassword, input)
        );

        return {
            user: toUserDto(user),
            token: 'token',
        };
    }
}
