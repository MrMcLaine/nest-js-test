import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { CreateBookReviewInput } from './dto/create-book-review-input.dto';
import { BookReviewDto } from './dto/book-review.dto';
import { generateReviewId } from './utils/generateBookReviewId';

@Injectable()
export class BookReviewsService {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async createBookReview(
        data: CreateBookReviewInput,
        userId: number
    ): Promise<BookReviewDto> {
        try {
            const reviewId = generateReviewId({
                bookId: data.bookId,
                userId,
            });

            const item = {
                reviewId,
                bookId: data.bookId,
                userId: userId,
                rating: data.rating,
                reviewText: data.reviewText ?? null,
                createdAt: new Date().toISOString(),
            };

            await this.dynamoDBService.putItem(DynamoTables.BOOK_REVIEWS, item);

            return item;
        } catch (error) {
            throw new Error(`Failed to create the review: ${error.message}`);
        }
    }
}
