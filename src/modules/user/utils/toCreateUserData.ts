import { RegisterUserInput } from '@user/dto/register-user.input';
import { UserRole } from '@user/constants/user-role.enum';
import { User } from '@user/user.entity';

export const toCreateUserData = (
    hashedPassword: string,
    data: RegisterUserInput
): Partial<User> => {
    return {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: UserRole.USER,
    };
};
