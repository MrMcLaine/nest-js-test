import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptUtil } from '@common/utils/bcrypt.util';
import { UserService } from '@user/user.service';
import { User } from '@user/user.entity';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { transformUserToDto } from '@user/utils/transformUserToDto';
import { buildUserData } from '@user/utils/buildUserData';
import { authServiceMock } from '../../../test-utils/mocks/auth-service.mock';
import { getTokenMock } from '../../../test-utils/mocks/get-token.mock';
import {
    failRegisterInput,
    mockRegisterUser,
    mockUser,
    registerInput,
} from '@user/__tests__/user.test-data';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, getTokenMock, authServiceMock],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findByEmailWithCheck', () => {
        it('should return a user if found', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

            const result = await userService.findByEmail(
                mockUser.email
            );

            expect(result).toEqual(mockUser);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({
                email: mockUser.email,
            });
        });

        it('should throw an error if user is not found', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

            await expect(
                userService.findByEmail('invalid@example.com')
            ).rejects.toThrow(
                'Error finding user by email: User with email invalid@example.com not found'
            );
        });
    });

    describe('createUser', () => {
        it('should create a user and return an AuthResponse', async () => {
            const hashedPassword = 'hashed-password';
            jest.spyOn(BcryptUtil, 'hashPassword').mockResolvedValue(
                hashedPassword
            );

            const mockUser: User = {
                ...mockRegisterUser,
                password: hashedPassword,
            };

            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

            const result: AuthResponse =
                await userService.createUser(registerInput);

            expect(result.user).toEqual(transformUserToDto(mockUser));
            expect(result.token).toBe('mocked-jwt-token');
            expect(userRepository.save).toHaveBeenCalledWith(
                buildUserData(hashedPassword, registerInput)
            );
        });

        it('should throw an error if user creation fails', async () => {
            jest.spyOn(userRepository, 'save').mockRejectedValue(
                new Error('Database error')
            );

            await expect(
                userService.createUser(failRegisterInput)
            ).rejects.toThrow('Failed to create user: Database error');
        });
    });
});
