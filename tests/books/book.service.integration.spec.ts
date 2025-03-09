import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@providers/redis/redis.service';
import {
    createBookErrorTitle,
    deleteBookErrorTitle,
    updateBookErrorTitle,
} from '@book/constants';
import { Book } from '@book/book.entity';
import { BookService } from '@book/book.service';
import { GetBooksResponseDto } from '@book/dto';
import { createTestModule } from '../config/db.test.module';
import { getBooksNoFilterMock } from '../redis/redis-mocks';
import {
    INVALID_CREATE_BOOK_DATA,
    INVALID_UPDATE_BOOK_DATA,
    MOCK_BOOK,
    NO_EXISTING_BOOK_ID,
    VALID_CREATE_BOOK_DATA,
} from './book.test-data';

describe('BookService (Integration)', () => {
    let bookService: BookService;
    let redisService: RedisService;
    let bookRepository: Repository<Book>;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        bookService = module.get<BookService>(BookService);
        redisService = module.get<RedisService>(RedisService);
        bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    });

    afterEach(async () => {
        await bookRepository.clear();
    });

    it('should successfully create a book', async () => {
        const savedBook = await bookService.createBook(VALID_CREATE_BOOK_DATA);

        const bookFromDB = await bookRepository.findOne({
            where: { id: savedBook.id },
        });

        expect(bookFromDB).not.toBeNull();
        expect(bookFromDB.title).toBe(MOCK_BOOK.title);
        expect(bookFromDB.author).toBe(MOCK_BOOK.author);
        expect(bookFromDB.publicationYear).toBe(MOCK_BOOK.publicationYear);
        expect(bookFromDB.description).toBe(MOCK_BOOK.description);
    });

    it('should throw an error when trying to create a book with missing fields', async () => {
        await expect(
            bookService.createBook(INVALID_CREATE_BOOK_DATA)
        ).rejects.toThrow(createBookErrorTitle);
    });

    // it('should return a list of books', async () => {
    //     const t = await bookService.createBook(VALID_CREATE_BOOK_DATA);
    //     console.log('t', t);
    //     getBooksNoFilterMock(null, redisService);
    //     const books = await bookService.getBooks();
    //
    //     console.log('books', books);
    //
    //     expect(books).toBeDefined();
    //     expect(books.books.length).toBe(1);
    //     expect(books.books[0].title).toBe(MOCK_BOOK.title);
    // });

    it('should use cache when fetching books', async () => {
        const savedBook = await bookService.createBook(VALID_CREATE_BOOK_DATA);

        const cachedBooks: GetBooksResponseDto = {
            books: [{ ...MOCK_BOOK, id: savedBook.id }],
            hasMore: false,
        };

        getBooksNoFilterMock(cachedBooks, redisService);

        const books = await bookService.getBooks();

        expect(books).toEqual(cachedBooks);
        expect(redisService.getBookPagesCache).toHaveBeenCalled();
    });

    // it('should successfully update a book', async () => {
    //     const book = await bookService.createBook(VALID_CREATE_BOOK_DATA);
    //
    //     console.log('book', book)
    //
    //     const updateData: UpdateBookInput = {
    //         id: book.id,
    //         title: VALID_UPDATE_BOOK_TITLE,
    //     };
    //
    //     const updatedBook = await bookService.updateBook(updateData);
    //
    //     console.log('upd', updatedBook)
    //
    //     expect(updatedBook.title).toBe(VALID_UPDATE_BOOK_TITLE);
    // });

    it('should throw an error when trying to update a non-existing book', async () => {
        await expect(
            bookService.updateBook(INVALID_UPDATE_BOOK_DATA)
        ).rejects.toThrow(updateBookErrorTitle);
    });

    it('should successfully delete a book', async () => {
        const book = await bookService.createBook(VALID_CREATE_BOOK_DATA);
        const result = await bookService.deleteBook(book.id);

        expect(result).toBe(`Book with ID ${book.id} deleted successfully`);

        const bookFromDB = await bookRepository.findOne({
            where: { id: book.id },
        });

        expect(bookFromDB).toBeNull();
    });

    it('should throw an error when trying to delete a non-existing book', async () => {
        await expect(
            bookService.deleteBook(NO_EXISTING_BOOK_ID)
        ).rejects.toThrow(deleteBookErrorTitle);
    });
});
