import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContextNest } from '@common/types/context-nest.type';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { AclGuard } from '@auth/acl.guard';
import { Permissions } from '@auth/utils/permissions.decorator';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';
import { BookReviewsService } from './book-reviews.service';
import { CreateBookReviewInput } from './dto/create-book-review-input.dto';
import { BookReviewDto } from './dto/book-review.dto';

@Resolver()
export class BookReviewsResolver {
    constructor(private readonly bookReviewService: BookReviewsService) {}

    @Mutation(() => BookReviewDto)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.CREATE_BOOK_REVIEW)
    async createBookReview(
        @Args('data') data: CreateBookReviewInput,
        @Context() context: ContextNest
    ): Promise<BookReviewDto> {
        return this.bookReviewService.createBookReview(data, context.user.sub);
    }


}
