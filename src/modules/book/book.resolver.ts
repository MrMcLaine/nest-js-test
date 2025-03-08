import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserActionPermissions } from '@auth/constants';
import { AclGuard, JwtAuthGuard } from '@auth/quards';
import { Permissions } from '@auth/utils';
import { BookService } from '@book/book.service';
import {
    CreateBookInput,
    UpdateBookInput,
    BookDto,
    GetBooksInput,
    GetBooksResponseDto,
} from '@book/dto';

@Resolver()
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @Query(() => GetBooksResponseDto)
    async getBooks(
        @Args('filters', { nullable: true }) filters?: GetBooksInput
    ): Promise<GetBooksResponseDto> {
        return this.bookService.getBooks(filters || {});
    }

    @Mutation(() => BookDto)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.CREATE_BOOK)
    async createBook(@Args('data') data: CreateBookInput): Promise<BookDto> {
        return this.bookService.createBook(data);
    }

    @Mutation(() => BookDto)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.UPDATE_BOOK)
    async updateBook(@Args('data') data: UpdateBookInput): Promise<BookDto> {
        return this.bookService.updateBook(data);
    }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.DELETE_BOOK)
    async deleteBook(@Args('id') id: number): Promise<string> {
        return this.bookService.deleteBook(id);
    }
}
