import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTestModule } from '../config/db.test.module';
import { UserService } from '@user/user.service';
import { User } from '@user/user.entity';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { transformUserToDto } from '@user/utils/transformUserToDto';
import {
    mockUser,
    registerInput,
    failRegisterInput,
} from '@user/__tests__/user.test-data';
import { testToken } from '../auth/auth.test-data';

describe('UserService (Integration)', () => {
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterAll(async () => {
        await userRepository.clear();
    });

    describe('findByEmailWithCheck', () => {
        it('should return a user if found', async () => {
            const user = await userRepository.save(mockUser);
            const result = await userService.findByEmail(user.email);

            expect(result).toEqual(user);
        });

        it('should throw an error if user is not found', async () => {
            await expect(
                userService.findByEmail('invalid@example.com')
            ).rejects.toThrow(
                'Error finding user by email: User with email invalid@example.com not found'
            );
        });
    });

    describe('createUser', () => {
        it('should create a user and return an AuthResponse', async () => {
            const result: AuthResponse =
                await userService.createUser(registerInput);

            const userInDB = await userRepository.findOne({
                where: { email: registerInput.email },
            });

            expect(userInDB).not.toBeNull();
            expect(result.user).toEqual(transformUserToDto(userInDB));
            expect(result.token).toBe(testToken);
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
