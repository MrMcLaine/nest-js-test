import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '@auth/auth.service';
import {
    invalidEmailOrPassword,
    registerUserErrorTitle,
} from '@auth/constants/error-messages';
import { AuthResponse } from '@auth/dto';
import { UserRole, ERROR_USER_ALREADY_EXISTS } from '@user/constants';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { UserDto } from '@user/dto/user-dto';
import { createTestModule } from '../config/db.test.module';
import {
    INVALID_LOGIN_DATA,
    MOCK_USER,
    VALID_LOGIN_DATA,
} from '../users/user.test-data';

describe('AuthService (Integration)', () => {
    let authService: AuthService;
    let userRepository: Repository<User>;
    let userService: UserService;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(async () => {
        await userRepository.clear();
    });

    it('should register a user and return a token', async () => {
        const result: AuthResponse = await authService.registerUser(MOCK_USER);
        const savedUser = await userService.findByEmail(MOCK_USER.email);

        validateUser(savedUser, MOCK_USER);
        expect(result.token).toBeDefined();
    });

    it('should throw an error if user already exists', async () => {
        await authService.registerUser(MOCK_USER);

        await expect(authService.registerUser(MOCK_USER)).rejects.toThrow(
            registerUserErrorTitle + ERROR_USER_ALREADY_EXISTS
        );
    });

    it('should login a valid user and return a token', async () => {
        await authService.registerUser(MOCK_USER);

        const result: AuthResponse = await authService.login(VALID_LOGIN_DATA);

        expect(result.token).toBeDefined();
        validateUser(result.user, MOCK_USER);
    });

    it('should throw an error if the email does not exist', async () => {
        await expect(authService.login(INVALID_LOGIN_DATA)).rejects.toThrow(
            invalidEmailOrPassword
        );
    });
});

const validateUser = (
    user: User | UserDto,
    expectedUserData: typeof MOCK_USER
) => {
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.role).toBe(UserRole.USER);
    expect(user.email).toBe(expectedUserData.email);
    expect(user.username).toBe(expectedUserData.username);
};
