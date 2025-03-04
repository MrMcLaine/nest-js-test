import { User } from '@user/user.model';
import { UserDto } from '@user/dto/user-dto';

export const toUserDto = (user: User): UserDto => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
};
