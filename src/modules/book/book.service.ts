import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@book/book.entity';
import { toBookDto } from '@book/utils/toBookDto';
import { BookInput } from '@book/dto/book-input.dto';
import { BookDto } from '@book/dto/book-dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) {}

    async createBook(input: BookInput): Promise<BookDto> {
        try {
            const newBook = this.bookRepository.create(input);
            const savedBook = await this.bookRepository.save(newBook);

            return toBookDto(savedBook);
        } catch (error) {
            throw new Error(`Failed to create book: ${error.message}`);
        }
    }
}
