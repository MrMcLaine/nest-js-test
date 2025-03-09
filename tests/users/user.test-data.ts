import { LoginAuthInput, RegisterUserInput } from '@auth/dto';

export const MOCK_USER = {
    email: 'test@example',
    password: 'test-password',
    username: 'Test User',
};

export const VALID_LOGIN_DATA: LoginAuthInput = {
    email: MOCK_USER.email,
    password: MOCK_USER.password,
};

export const INVALID_LOGIN_DATA: LoginAuthInput = {
    email: 'invalid@example',
    password: 'wrong-password',
};
