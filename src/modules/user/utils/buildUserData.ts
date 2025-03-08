import { RegisterUserInput } from '@auth/dto';
import { UserRole } from '@user/constants';
import { User } from '@user/user.entity';

export const buildUserData = (
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
