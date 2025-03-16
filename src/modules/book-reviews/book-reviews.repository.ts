import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { convertToUpdateCommandInput } from '@common/utils';
import { CreateBookReviewInput } from '@book-reviews/dto';
import { BookReview } from '@book-reviews/types/book-review.type';

@Injectable()
export class BookReviewsRepository {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async getAllBookReviews(): Promise<BookReview[]> {
        return this.dynamoDBService.queryByGSI<BookReview>(
            'EntityTypeIndex',
            'EntityType',
            'REVIEW'
        );
    }

    async createBookReview(
        data: CreateBookReviewInput,
        userId: string
    ): Promise<BookReview> {
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
        return bookReviewData;
    }

    async updateBookReview(input: {
        bookId: string;
        userId: string;
        updates: Partial<BookReview>;
    }): Promise<BookReview> {
        const updateParams = convertToUpdateCommandInput({
            key: { PK: `BOOK#${input.bookId}`, SK: `USER#${input.userId}` },
            updates: input.updates,
            includeUpdatedAt: true,
        });

        return await this.dynamoDBService.updateItem(updateParams);
    }

    async deleteBookReview(input: {
        bookId: string;
        userId: string;
    }): Promise<void> {
        await this.dynamoDBService.deleteItem(
            `BOOK#${input.bookId}`,
            `USER#${input.userId}`
        );
    }

    async getBookReviewByUser(input: {
        userId: string;
        bookId: string;
    }): Promise<BookReview | null> {
        const reviews = await this.dynamoDBService.queryByPK<BookReview>(
            `BOOK#${input.bookId}`,
            `USER#${input.userId}`
        );
        return reviews.length > 0 ? reviews[0] : null;
    }
}
