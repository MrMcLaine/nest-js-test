import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';
import { AclGuard } from '@auth/acl.guard';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Permissions } from '@auth/utils/permissions.decorator';
import { BookService } from '@book/book.service';
import { BookInput } from '@book/dto/book-input.dto';
import { BookDto } from '@book/dto/book-dto';

@Resolver()
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @Mutation(() => BookDto)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.CREATE_BOOK)
    async createBook(@Args('data') data: BookInput): Promise<BookDto> {
        return this.bookService.createBook(data);
    }
}
