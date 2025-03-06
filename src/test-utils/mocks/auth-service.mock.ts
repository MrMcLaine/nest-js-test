import { AuthService } from '@auth/auth.service';

export const authServiceMock = {
    provide: AuthService,
    useValue: {
        generateToken: jest.fn().mockReturnValue('mocked-jwt-token'),
    },
};
