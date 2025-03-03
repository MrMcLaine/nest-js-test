import { Injectable } from '@nestjs/common';
import { UserRole } from './constants/user-role.enum';
import { BcryptUtil } from './utils/bcrypt.util';
import { RegisterUserInput } from './dto/register-user.input';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
    async createUser(input: RegisterUserInput): Promise<UserDto> {
        console.log('input', input);

        const hashedPassword = await BcryptUtil.hashPassword(input.password);
        console.log('hashedPassword', hashedPassword);

        return {
            id: 1,
            username: input.username,
            email: input.email,
            role: UserRole.USER,
        };
    }
}
