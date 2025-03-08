import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/user.entity';
import { transformUserToDto } from '@user/utils';
import { UserDto } from '@user/dto/user-dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOneBy({ email });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async createUser(input: Partial<User>): Promise<UserDto> {
        try {
            const user = await this.userRepository.save(input);

            return transformUserToDto(user);
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
}
