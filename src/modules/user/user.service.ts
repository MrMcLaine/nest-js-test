import { Injectable } from '@nestjs/common';
import { User } from '@user/user.entity';
import { UserRepository } from '@user/user.repository';
import { createUserErrorHandlerUtil } from '@user/errors/create-user-error-handler.util';
import { transformUserToDto } from '@user/utils';
import { UserDto } from '@user/dto/user-dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findByEmail(email);
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async createUser(input: Partial<User>): Promise<UserDto> {
        try {
            const user = await this.userRepository.createUser(input);

            return transformUserToDto(user);
        } catch (error) {
            createUserErrorHandlerUtil(error);
        }
    }
}
