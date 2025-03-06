import { LoginAuthInput } from '@auth/dto/login-auth.input';
import { mockUser } from '@user/__tests__/user.test-data';

export const mockLoginInput: LoginAuthInput = {
    email: mockUser.email,
    password: mockUser.password,
};

export const mockInvalidLoginInput: LoginAuthInput = {
    email: 'invalid@example.com',
    password: 'wrong-password',
};
