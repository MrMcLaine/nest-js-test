import { getRepositoryToken } from '@nestjs/typeorm';
import { TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createTestModule } from '../config/db.test.module';
import { AuthService } from '@auth/auth.service';
import { User } from '@user/user.entity';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { transformUserToDto } from '@user/utils/transformUserToDto';
import { mockLoginInput, UserData } from './auth.test-data';

describe('AuthService (Integration)', () => {
    let authService: AuthService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
    });

    afterAll(async () => {
        await userRepository.clear();
    });

    it('should login a valid user and return a token', async () => {
        const hashedPassword = await bcrypt.hash(UserData.password, 10);

        const user = userRepository.create({
            email: UserData.email,
            username: UserData.username,
            password: hashedPassword,
        });

        await userRepository.save(user);

        jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-jwt-token');

        const result: AuthResponse = await authService.login(UserData);

        expect(result.user).toEqual(transformUserToDto(user));
        expect(result.token).toBe('mocked-jwt-token');
    });

    it('should throw an error if the email does not exist', async () => {
        await expect(authService.login(mockLoginInput)).rejects.toThrow(
            `Error finding user by email: User with email ${mockLoginInput.email} not found`
        );
    });
});
