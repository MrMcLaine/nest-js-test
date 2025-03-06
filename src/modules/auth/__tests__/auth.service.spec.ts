import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { AuthResponse } from '@user/dto/auth-response.dto';
import { toUserDto } from '@user/utils/toUserDto';
import { toJwtPayload } from '@auth/utils/toJwtPayload';
import { jwtServiceMock } from '../../../test-utils/mocks/jwt-service.mock';
import { userServiceMock } from '../../../test-utils/mocks/user-service.mock';
import {
    mockInvalidLoginInput,
    mockLoginInput,
    mockUser,
} from '@auth/__tests__/auth.test-data';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, jwtServiceMock, userServiceMock],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a user DTO and token when login is successful', async () => {
        jest.spyOn(userService, 'findByEmailWithCheck').mockResolvedValue(
            mockUser
        );
        jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-jwt-token');

        const result: AuthResponse = await authService.login(mockLoginInput);

        expect(result).toEqual({
            user: toUserDto(mockUser),
            token: 'mocked-jwt-token',
        });

        expect(userService.findByEmailWithCheck).toHaveBeenCalledWith(
            mockLoginInput.email
        );
        expect(jwtService.sign).toHaveBeenCalledWith(
            toJwtPayload(toUserDto(mockUser))
        );
    });

    it('should throw an error if the email is not found', async () => {
        jest.spyOn(userService, 'findByEmailWithCheck').mockRejectedValue(
            new Error('User not found')
        );

        await expect(authService.login(mockInvalidLoginInput)).rejects.toThrow(
            'User not found'
        );

        expect(userService.findByEmailWithCheck).toHaveBeenCalledWith(
            mockInvalidLoginInput.email
        );
        expect(jwtService.sign).not.toHaveBeenCalled();
    });
});
