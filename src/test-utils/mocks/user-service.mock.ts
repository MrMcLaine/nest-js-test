import { UserService } from '@user/user.service';

export const userServiceMock = {
    provide: UserService,
    useValue: {
        findByEmailWithCheck: jest.fn(),
    },

};
