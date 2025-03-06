import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@user/user.entity';

export const getTokenMock = {
    provide: getRepositoryToken(User),
    useValue: {
        findOneBy: jest.fn(),
        save: jest.fn(),
    },
};
