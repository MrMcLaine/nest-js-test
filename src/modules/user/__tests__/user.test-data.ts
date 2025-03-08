import { User } from '@user/user.entity';
import { UserRole } from '@user/constants/user-role.enum';
import { RegisterUserInput } from '@user/dto/register-user.input';

export const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'Test User',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: UserRole.USER,
};

export const mockRegisterUser: User = {
    id: '1',
    email: 'new@example.com',
    username: 'New User',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: UserRole.USER,
};

export const registerInput: RegisterUserInput = {
    email: mockRegisterUser.email,
    username: mockRegisterUser.username,
    password: mockRegisterUser.password,
};

export const failRegisterInput: RegisterUserInput = {
    email: 'fail@example.com',
    username: 'Fail User',
    password: 'password123',
};
