import { Injectable } from '@nestjs/common';
import { checkAffectedRows } from '@common/errors';
import { RedisService } from '@providers/redis/redis.service';
import {
    createBookErrorTitle,
    deleteBookErrorTitle,
    updateBookErrorTitle,
} from '@book/constants';
import { BookRepository } from '@book/book.repository';
import {
    transformBookToDto,
    calculatePagination,
    isCacheable,
} from '@book/utils';
import {
    CreateBookInput,
    BookDto,
    UpdateBookInput,
    GetBooksInput,
    GetBooksResponseDto,
} from '@book/dto';

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly redisService: RedisService
    ) {}

    async getBooks(input?: GetBooksInput): Promise<GetBooksResponseDto> {
        try {
            const isCacheableObject = isCacheable(input);

            if (isCacheableObject) {
                const cachedData =
                    await this.redisService.getBookPagesCache(input);

                if (cachedData) return cachedData;
            }

            const books = await this.bookRepository.findBooks(input);
            const { hasMore, data } = calculatePagination(books, input);

            const bookDtos = data.map(transformBookToDto);
            const response: GetBooksResponseDto = { books: bookDtos, hasMore };

            if (isCacheable(input))
                await this.redisService.setBookPagesCache(response, input);

            return response;
        } catch (error) {
            throw new Error(`Failed to get books: ${error.message}`);
        }
    }

    async createBook(input: CreateBookInput): Promise<BookDto> {
        try {
            const savedBook = await this.bookRepository.createBook(input);
            await this.redisService.clearAllBookPagesCache();

            return transformBookToDto(savedBook);
        } catch (error) {
            throw new Error(`${createBookErrorTitle}: ${error.message}`);
        }
    }

    async updateBook(input: UpdateBookInput): Promise<BookDto> {
        try {
            const { id, ...updateData } = input;

            const { affected, book } = await this.bookRepository.updateBookData(
                id,
                updateData
            );

            checkAffectedRows({
                affected,
                entityName: 'Book',
                id,
            });

            await this.redisService.clearAllBookPagesCache();

            return transformBookToDto(book);
        } catch (error) {
            throw new Error(`${updateBookErrorTitle}: ${error.message}`);
        }
    }

    async deleteBook(id: string): Promise<string> {
        try {
            const affected = await this.bookRepository.deleteBookById(id);

            checkAffectedRows({
                affected,
                entityName: 'Book',
                id,
            });

            await this.redisService.clearAllBookPagesCache();

            return `Book with ID ${id} deleted successfully`;
        } catch (error) {
            throw new Error(`${deleteBookErrorTitle}: ${error.message}`);
        }
    }
}
