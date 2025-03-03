import { Injectable } from '@nestjs/common';
import { UserRole } from './constants/user-role.enum';
import { RegisterUserInput } from './dto/register-user.input';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
    createUser(data: RegisterUserInput): UserDto {
        console.log('data', data);
        return {
            id: 1,
            username: data.username,
            email: data.email,
            role: UserRole.USER,
        };
    }
}
