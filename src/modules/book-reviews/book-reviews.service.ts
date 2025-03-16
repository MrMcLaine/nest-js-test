import { Injectable } from '@nestjs/common';
import { convertToUpdateCommandInput } from '@common/utils';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { RedisService } from '@providers/redis/redis.service';
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

            const reviews = await this.dynamoDBService.queryByGSI<BookReview>(
                'EntityTypeIndex',
                'EntityType',
                'REVIEW'
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
            const bookReviewData: BookReview = {
                PK: `BOOK#${data.bookId}`,
                SK: `USER#${userId}`,
                bookId: data.bookId,
                userId,
                rating: data.rating,
                reviewText: data.reviewText,
                createdAt: new Date().toISOString(),
                EntityType: 'REVIEW',
            };

            await this.dynamoDBService.putItem(bookReviewData);

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
            await this.checkBookReviewOwner({ userId, bookId: data.bookId });

            const updateParams = convertToUpdateCommandInput({
                key: { PK: `BOOK#${data.bookId}`, SK: `USER#${userId}` },
                updates: {
                    rating: data.rating,
                    reviewText: data.reviewText,
                },
                includeUpdatedAt: true,
            });

            const updatedReview =
                await this.dynamoDBService.updateItem(updateParams);

            await this.redisService.deleteAllBookReviewsCache();

            return updatedReview;
        } catch (error) {
            throw new Error(`Failed to update the review: ${error.message}`);
        }
    }

    async deleteBookReview(bookId: string, userId: string): Promise<string> {
        try {
            await this.checkBookReviewOwner({ userId, bookId });
            await this.dynamoDBService.deleteItem(
                `BOOK#${bookId}`,
                `USER#${userId}`
            );

            await this.redisService.deleteAllBookReviewsCache();

            return `Review for book with ID ${bookId} deleted successfully`;
        } catch (error) {
            throw new Error(`Failed to delete the review: ${error.message}`);
        }
    }

    private async checkBookReviewOwner(input: {
        userId: string;
        bookId: string;
    }): Promise<void> {
        const review = await this.dynamoDBService.queryByPK<BookReview>(
            `BOOK#${input.bookId}`,
            `USER#${input.userId}`
        );

        if (!review || review.length === 0) {
            throw new Error('You are not the owner of this book review');
        }
    }
}
