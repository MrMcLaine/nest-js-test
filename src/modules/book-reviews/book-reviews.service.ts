import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { CreateBookReviewInput } from './dto/create-book-review-input.dto';
import { BookReviewDto } from './dto/book-review.dto';
import { generateReviewId } from './utils/generateBookReviewId';
import { toBookReview } from './utils/toBookReview';

@Injectable()
export class BookReviewsService {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

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
}
