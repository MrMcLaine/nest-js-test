import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { checkAffectedRows } from '@common/errors/check-affected.util';
import { Book } from '@book/book.entity';
import { toBookDto } from '@book/utils/toBookDto';
import { getBookFilters } from '@book/utils/getBooksFilter';
import { getHasMore } from '@book/utils/getHasMore';
import { CreateBookInput } from '@book/dto/create-book-input.dto';
import { BookDto } from '@book/dto/book-dto';
import { UpdateBookInput } from '@book/dto/update-book-input.dto';
import { GetBooksInput } from '@book/dto/get-books-input.dto';
import { GetBooksResponseDto } from '@book/dto/get-books-response.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) {}

    async getBooks(input?: GetBooksInput): Promise<GetBooksResponseDto> {
        try {
            let queryBuilder = this.bookRepository.createQueryBuilder('book');
            queryBuilder = getBookFilters(queryBuilder, input);

            const books = await queryBuilder.getMany();
            const { hasMore, data } = getHasMore(books, input?.limit);

            return {
                books: data.map(toBookDto),
                hasMore,
            };
        } catch (error) {
            throw new Error(`Failed to get books: ${error.message}`);
        }
    }

    async createBook(input: CreateBookInput): Promise<BookDto> {
        try {
            const newBook = this.bookRepository.create(input);
            const savedBook = await this.bookRepository.save(newBook);

            return toBookDto(savedBook);
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

            return toBookDto(result.raw[0]);
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

            return `Book with ID ${id} deleted successfully`;
        } catch (error) {
            throw new Error(`Failed to delete book: ${error.message}`);
        }
    }
}
