import { User } from '@user/user.entity';
import { UserRole } from '@user/constants/user-role.enum';
import { LoginAuthInput } from '@auth/dto/login-auth.input';

export const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'Test User',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: UserRole.USER,
};

export const mockLoginInput: LoginAuthInput = {
    email: 'test@example.com',
    password: 'test-password',
};

export const mockInvalidLoginInput: LoginAuthInput = {
    email: 'invalid@example.com',
    password: 'wrong-password',
};
