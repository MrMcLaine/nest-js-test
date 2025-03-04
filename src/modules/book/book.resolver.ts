import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';
import { AclGuard } from '@auth/acl.guard';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Permissions } from '@auth/utils/permissions.decorator';
import { BookService } from '@book/book.service';
import { CreateBookInput } from '@book/dto/create-book-input.dto';
import { UpdateBookInput } from '@book/dto/update-book-input.dto';
import { BookDto } from '@book/dto/book-dto';
import { GetBooksInput } from '@book/dto/get-books-input.dto';
import { GetBooksResponseDto } from '@book/dto/get-books-response.dto';

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
