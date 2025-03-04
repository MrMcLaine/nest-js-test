import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@book/book.entity';
import { toBookDto } from '@book/utils/toBookDto';
import { CreateBookInput } from '@book/dto/create-book-input.dto';
import { BookDto } from '@book/dto/book-dto';
import { UpdateBookInput } from '@book/dto/update-book-input.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) {}

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

            if (result.affected === 0) {
                throw new NotFoundException(`Book with ID ${id} not found`);
            }

            return toBookDto(result.raw[0]);
        } catch (error) {
            throw new Error(`Failed to update book: ${error.message}`);
        }
    }
}
