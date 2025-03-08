import {Args, Mutation, Resolver, Context, Query} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContextNest } from '@common/types/context-nest.type';
import { JwtAuthGuard } from '@auth/quards/jwt-auth.guard';
import { AclGuard } from '@auth/quards/acl.guard';
import { Permissions } from '@auth/utils/permissions.decorator';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';
import { BookReviewsService } from './book-reviews.service';
import { CreateBookReviewInput } from './dto/create-book-review-input.dto';
import { BookReviewDto } from './dto/book-review.dto';
import { UpdateBookReviewInput } from './dto/update-book-review-input.dto';

@Resolver()
export class BookReviewsResolver {
    constructor(private readonly bookReviewService: BookReviewsService) {}

    @Query(() => [BookReviewDto])
    async getAllBookReviews(): Promise<BookReviewDto[]> {
        return this.bookReviewService.getAllBookReviews();
    }

    @Mutation(() => BookReviewDto)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.CREATE_BOOK_REVIEW)
    async createBookReview(
        @Args('data') data: CreateBookReviewInput,
        @Context() context: ContextNest
    ): Promise<BookReviewDto> {
        return this.bookReviewService.createBookReview(data, context.user.sub);
    }

    @Mutation(() => BookReviewDto)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.UPDATE_BOOK_REVIEW)
    async updateBookReview(
        @Args('data') data: UpdateBookReviewInput,
        @Context() context: ContextNest
    ): Promise<BookReviewDto> {
        return this.bookReviewService.updateBookReview(data, context.user.sub);
    }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard, AclGuard)
    @Permissions(UserActionPermissions.DELETE_BOOK_REVIEW)
    async deleteBookReview(
        @Args('reviewId') reviewId: string,
        @Context() context: ContextNest
    ): Promise<string> {
        return this.bookReviewService.deleteBookReview(
            reviewId,
            context.user.sub
        );
    }
}
