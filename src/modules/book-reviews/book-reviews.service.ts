import { Injectable } from '@nestjs/common';
import { DynamoTables } from '@common/enums';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { RedisService } from '@providers/redis/redis.service';
import {
    transformBookReviewToDto,
    transformToUpdateDynamodbItemInputByReview,
    extractUserIdFromReviewId,
} from '@book-reviews/utils';
import {
    CreateBookReviewInput,
    BookReviewDto,
    UpdateBookReviewInput,
} from '@book-reviews/dto';
import { BookReview } from '@book-reviews/types/book-review.type';

@Injectable()
export class BookReviewsService {
    constructor(
        private readonly dynamoDBService: DynamoDBService,
        private readonly redisService: RedisService
    ) {}

    async getAllBookReviews(): Promise<BookReviewDto[]> {
        try {
            const reviewCached =
                await this.redisService.getAllBookReviewsFromCache();

            if (reviewCached) return reviewCached;

            const reviews = await this.dynamoDBService.scanTable<BookReview>(
                DynamoTables.BOOK_REVIEWS
            );

            await this.redisService.setAllBookReviewsToCache(reviews);

            return reviews;
        } catch (error) {
            throw new Error(
                `Failed to retrieve book reviews: ${error.message}`
            );
        }
    }

    async createBookReview(
        data: CreateBookReviewInput,
        userId: string
    ): Promise<BookReviewDto> {
        try {
            const bookReviewData = transformBookReviewToDto(userId, data);
            await this.dynamoDBService.putItem(
                DynamoTables.BOOK_REVIEWS,
                bookReviewData
            );

            await this.redisService.deleteAllBookReviewsCache();

            return bookReviewData;
        } catch (error) {
            throw new Error(`Failed to create the review: ${error.message}`);
        }
    }

    async updateBookReview(
        data: UpdateBookReviewInput,
        userId: string
    ): Promise<BookReviewDto> {
        try {
            this.checkBookReviewOwner({ userId, reviewId: data.reviewId });

            const updatedReview = await this.dynamoDBService.updateItem(
                transformToUpdateDynamodbItemInputByReview(data)
            );

            await this.redisService.deleteAllBookReviewsCache();

            return updatedReview;
        } catch (error) {
            throw new Error(`Failed to update the review: ${error.message}`);
        }
    }

    async deleteBookReview(reviewId: string, userId: string): Promise<string> {
        try {
            this.checkBookReviewOwner({ userId, reviewId });
            await this.dynamoDBService.deleteItem(DynamoTables.BOOK_REVIEWS, {
                reviewId,
            });

            await this.redisService.deleteAllBookReviewsCache();

            return `Review with ID ${reviewId} deleted successfully`;
        } catch (error) {
            throw new Error(`Failed to delete the review: ${error.message}`);
        }
    }

    private checkBookReviewOwner(input: {
        userId: string;
        reviewId: string;
    }): void {
        const userIdFromReviewId = extractUserIdFromReviewId(input.reviewId);

        if (input.userId !== userIdFromReviewId) {
            throw new Error('You are not the owner of this book review');
        }
    }
}
