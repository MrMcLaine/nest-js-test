import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '@book/book.entity';

export const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
            affected: 1,
            raw: [{ id: 1, title: 'Updated Title' }],
        }),
    })),
};

export const mockBookRepoProvider = {
    provide: getRepositoryToken(Book),
    useValue: mockBookRepository,
};
