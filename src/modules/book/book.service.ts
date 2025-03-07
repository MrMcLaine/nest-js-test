import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { checkAffectedRows } from '@common/errors';
import { RedisService } from '@providers/redis/redis.service';
import { Book } from '@book/book.entity';
import {
    transformBookToDto,
    buildBookQuery,
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
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
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

            let queryBuilder = this.bookRepository.createQueryBuilder('book');
            queryBuilder = buildBookQuery(queryBuilder, input);

            const books = await queryBuilder.getMany();
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
            const newBook = this.bookRepository.create(input);
            const savedBook = await this.bookRepository.save(newBook);

            await this.redisService.clearAllBookPagesCache();

            return transformBookToDto(savedBook);
        } catch (error) {
            throw new Error(`Failed to create book: ${error.message}`);
        }
    }

    async updateBook(input: UpdateBookInput): Promise<BookDto> {
        try {
            const { id, ...updateData } = input;

            const result = await this.bookRepository
                .createQueryBuilder()
                .update(Book)
                .set(updateData)
                .where('id = :id', { id })
                .returning('*')
                .execute();

            checkAffectedRows({
                affected: result.affected,
                entityName: 'Book',
                id,
            });

            await this.redisService.clearAllBookPagesCache();

            return transformBookToDto(result.raw[0]);
        } catch (error) {
            throw new Error(`Failed to update book: ${error.message}`);
        }
    }

    async deleteBook(id: number): Promise<string> {
        try {
            const result = await this.bookRepository.delete(id);

            checkAffectedRows({
                affected: result.affected,
                entityName: 'Book',
                id,
            });

            await this.redisService.clearAllBookPagesCache();

            return `Book with ID ${id} deleted successfully`;
        } catch (error) {
            throw new Error(`Failed to delete book: ${error.message}`);
        }
    }
}
