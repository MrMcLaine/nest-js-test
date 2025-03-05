import { Injectable } from '@nestjs/common';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { toBookReview } from './utils/toBookReview';
import { toUpdateDynamodbItemInputByReview } from './utils/toUpdateDynamodbItemInputByReview';
import { checkBookReviewOwner } from './utils/check-book-review-owner.util';
import { CreateBookReviewInput } from './dto/create-book-review-input.dto';
import { BookReviewDto } from './dto/book-review.dto';
import { UpdateBookReviewInput } from './dto/update-book-review-input.dto';
import { BookReview } from './types/book-review.type';

@Injectable()
export class BookReviewsService {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async getAllBookReviews(): Promise<BookReviewDto[]> {
        try {
            return await this.dynamoDBService.scanTable<BookReview>(
                DynamoTables.BOOK_REVIEWS
            );
        } catch (error) {
            throw new Error(
                `Failed to retrieve book reviews: ${error.message}`
            );
        }
    }

    async createBookReview(
        data: CreateBookReviewInput,
        userId: number
    ): Promise<BookReviewDto> {
        try {
            const bookReviewData = toBookReview(userId, data);

            await this.dynamoDBService.putItem(
                DynamoTables.BOOK_REVIEWS,
                bookReviewData
            );

            return bookReviewData;
        } catch (error) {
            throw new Error(`Failed to create the review: ${error.message}`);
        }
    }

    async updateBookReview(
        data: UpdateBookReviewInput,
        userId: number
    ): Promise<BookReviewDto> {
        try {
            checkBookReviewOwner({ userId, reviewId: data.reviewId });

            return await this.dynamoDBService.updateItem(
                toUpdateDynamodbItemInputByReview(data)
            );
        } catch (error) {
            throw new Error(`Failed to update the review: ${error.message}`);
        }
    }

    async deleteBookReview(reviewId: string, userId: number): Promise<string> {
        try {
            checkBookReviewOwner({ userId, reviewId });

            await this.dynamoDBService.deleteItem(DynamoTables.BOOK_REVIEWS, {
                reviewId,
            });

            return `Review with ID ${reviewId} deleted successfully`;
        } catch (error) {
            throw new Error(`Failed to delete the review: ${error.message}`);
        }
    }
}
