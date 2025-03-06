import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTestModule } from '../config/db.test.module';
import { Book } from '@book/book.entity';
import { BookService } from '@book/book.service';
import { bookTestData } from './book.test-data';

describe('BookService (Integration)', () => {
    let bookService: BookService;
    let bookRepository: Repository<Book>;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        bookService = module.get<BookService>(BookService);
        bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    });

    afterAll(async () => {
        await bookRepository.clear();
    });

    it('should save a book to the database', async () => {
        const savedBook = await bookService.createBook(bookTestData.validBook);

        const bookInDB = await bookRepository.findOne({
            where: { id: savedBook.id },
        });

        expect(bookInDB).not.toBeNull();
        expect(bookInDB.title).toBe(bookTestData.validBook.title);
        expect(bookInDB.author).toBe(bookTestData.validBook.author);
        expect(bookInDB.publicationYear).toBe(bookTestData.validBook.publicationYear);
    });
});
