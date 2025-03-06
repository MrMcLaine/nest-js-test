import {LoginAuthInput} from "@auth/dto/login-auth.input";

export const UserData = {
    email: 'test@example.com',
    password: 'test-password',
    username: 'Test User',
};

export const mockLoginInput: LoginAuthInput = {
    email: 'invalid@example.com',
    password: 'test-password',
};
