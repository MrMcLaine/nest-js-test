import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BookService } from '@book/book.service';
import { BookInput } from '@book/dto/book-input.dto';
import {BookDto} from "@book/dto/book-dto";

@Resolver()
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @Mutation(() => BookDto)
    async createBook(@Args('data') data: BookInput): Promise<BookDto> {
        return this.bookService.createBook(data);
    }
}
