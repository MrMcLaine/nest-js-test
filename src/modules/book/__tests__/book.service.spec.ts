import { Test, TestingModule } from '@nestjs/testing';
import { mockRedisProvider } from '../../../test-utils/mocks/redis.mock';
import {
    mockBookRepoProvider,
    mockBookRepository,
} from '@book/__tests__/book.mock';
import { BookService } from '../book.service';
import { bookErrors } from './book.errors';
import {
    mockBook,
    createBookInput,
    updateBookInput,
    mockUpdatedBook,
} from './book.test-data';

describe('BookService', () => {
    let bookService: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookService, mockBookRepoProvider, mockRedisProvider],
        }).compile();

        bookService = module.get<BookService>(BookService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getBooks', () => {
        it('should return books from the database', async () => {
            jest.spyOn(
                mockBookRepository,
                'createQueryBuilder'
            ).mockImplementation(
                () =>
                    ({
                        where: jest.fn().mockReturnThis(),
                        andWhere: jest.fn().mockReturnThis(),
                        limit: jest.fn().mockReturnThis(),
                        offset: jest.fn().mockReturnThis(),
                        getMany: jest.fn().mockResolvedValue([mockBook]),
                    }) as any
            );

            const result = await bookService.getBooks({});
            expect(result.books).toHaveLength(1);
            expect(result.books[0].id).toBe(1);
        });

        it('should throw an error when query fails', async () => {
            jest.spyOn(
                mockBookRepository,
                'createQueryBuilder'
            ).mockImplementation(() => {
                throw new Error('DB error');
            });

            await expect(bookService.getBooks({})).rejects.toThrow(
                bookErrors.failedToGetBooks
            );
        });
    });

    describe('createBook', () => {
        it('should create a book and return DTO', async () => {
            jest.spyOn(mockBookRepository, 'create').mockReturnValue(mockBook);
            jest.spyOn(mockBookRepository, 'save').mockResolvedValue(mockBook);

            const result = await bookService.createBook(createBookInput);
            expect(result.id).toBe(1);
            expect(result.title).toBe('Mock Book');
        });

        it('should throw an error when creation fails', async () => {
            jest.spyOn(mockBookRepository, 'save').mockRejectedValue(
                new Error('DB error')
            );

            await expect(
                bookService.createBook(createBookInput)
            ).rejects.toThrow(bookErrors.failedToCreateBook);
        });
    });

    describe('updateBook', () => {
        it('should update a book and return DTO', async () => {
            jest.spyOn(
                mockBookRepository,
                'createQueryBuilder'
            ).mockImplementation(
                () =>
                    ({
                        update: jest.fn().mockReturnThis(),
                        set: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        returning: jest.fn().mockReturnThis(),
                        execute: jest.fn().mockResolvedValue({
                            affected: 1,
                            raw: [mockUpdatedBook],
                        }),
                    }) as any
            );

            const result = await bookService.updateBook(updateBookInput);
            expect(result.title).toBe('Updated Book Title');
        });

        it('should throw an error when book update fails', async () => {
            jest.spyOn(
                mockBookRepository,
                'createQueryBuilder'
            ).mockImplementation(
                () =>
                    ({
                        update: jest.fn().mockReturnThis(),
                        set: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        returning: jest.fn().mockReturnThis(),
                        execute: jest.fn().mockResolvedValue({ affected: 0 }),
                    }) as any
            );

            await expect(
                bookService.updateBook({ id: 99, title: 'Unknown' })
            ).rejects.toThrow(bookErrors.failedToUpdateBook(99));
        });
    });

    describe('deleteBook', () => {
        it('should delete a book and return success message', async () => {
            jest.spyOn(mockBookRepository, 'delete').mockResolvedValue({
                affected: 1,
            } as any);

            const result = await bookService.deleteBook(1);
            expect(result).toBe('Book with ID 1 deleted successfully');
        });

        it('should throw an error when book is not found', async () => {
            jest.spyOn(mockBookRepository, 'delete').mockResolvedValue({
                affected: 0,
            } as any);

            await expect(bookService.deleteBook(99)).rejects.toThrow(
                bookErrors.failedToDeleteBook(99)
            );
        });
    });
});
