import { TestingModule } from '@nestjs/testing';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { DynamoDBService } from '../../src/providers/dynamodb/dynamodb.service';
import { RedisService } from '../../src/providers/redis/redis.service';
import { BookReviewsService } from '@book-reviews/book-reviews.service';
import { transformBookReviewToDto } from '@book-reviews/utils/transformBookReviewToDto';
import { toUpdateDynamodbItemInputByReview } from '@book-reviews/utils/toUpdateDynamodbItemInputByReview';
import { createTestModule } from '../config/db.test.module';
import {
    createBookReviewInput,
    mockReviews,
    mockUserId,
    updateBookReviewInput,
} from './book-reviews.test-data';

describe('BookReviewsService (Integration)', () => {
    let bookReviewsService: BookReviewsService;
    let dynamoDBService: DynamoDBService;
    let redisService: RedisService;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        bookReviewsService = module.get<BookReviewsService>(BookReviewsService);
        dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
        redisService = module.get<RedisService>(RedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllBookReviews', () => {
        it('should return cached book reviews if available', async () => {
            jest.spyOn(
                redisService,
                'getAllBookReviewsFromCache'
            ).mockResolvedValue(mockReviews);

            const result = await bookReviewsService.getAllBookReviews();

            expect(result).toEqual(mockReviews);
            expect(redisService.getAllBookReviewsFromCache).toHaveBeenCalled();
            expect(dynamoDBService.scanTable).not.toHaveBeenCalled();
        });

        it('should fetch book reviews from DynamoDB if cache is empty', async () => {
            jest.spyOn(
                redisService,
                'getAllBookReviewsFromCache'
            ).mockResolvedValue(null);
            jest.spyOn(dynamoDBService, 'scanTable').mockResolvedValue([
                mockReviews,
            ]);

            const result = await bookReviewsService.getAllBookReviews();

            expect(result).toHaveLength(1);
            expect(dynamoDBService.scanTable).toHaveBeenCalledWith(
                DynamoTables.BOOK_REVIEWS
            );
            expect(redisService.setAllBookReviewsToCache).toHaveBeenCalled();
        });
    });

    describe('createBookReview', () => {
        it('should create a new book review and store in DynamoDB', async () => {
            const mockReview = transformBookReviewToDto(mockUserId, createBookReviewInput);

            jest.spyOn(dynamoDBService, 'putItem').mockResolvedValue();

            const result = await bookReviewsService.createBookReview(
                createBookReviewInput,
                mockUserId
            );

            expect(result).toEqual(mockReview);
            expect(redisService.deleteAllBookReviewsCache).toHaveBeenCalled();
            expect(dynamoDBService.putItem).toHaveBeenCalledWith(
                DynamoTables.BOOK_REVIEWS,
                mockReview
            );
        });

        it('should throw an error if DynamoDB insertion fails', async () => {
            jest.spyOn(dynamoDBService, 'putItem').mockRejectedValue(
                new Error('DynamoDB error')
            );

            await expect(
                bookReviewsService.createBookReview(
                    createBookReviewInput,
                    mockUserId
                )
            ).rejects.toThrow('Failed to create the review: DynamoDB error');
        });
    });

    describe('updateBookReview', () => {
        it('should update a book review successfully', async () => {
            const mockUpdateInput = toUpdateDynamodbItemInputByReview(
                updateBookReviewInput
            );
            const updatedReview = { reviewId: '1', ...updateBookReviewInput };

            jest.spyOn(dynamoDBService, 'updateItem').mockResolvedValue(
                updatedReview
            );

            const result = await bookReviewsService.updateBookReview(
                updateBookReviewInput,
                mockUserId
            );

            expect(result).toEqual(updatedReview);
            expect(redisService.deleteAllBookReviewsCache).toHaveBeenCalled();
            expect(dynamoDBService.updateItem).toHaveBeenCalledWith(
                mockUpdateInput
            );
        });

        it('should throw an error if update fails', async () => {
            jest.spyOn(dynamoDBService, 'updateItem').mockRejectedValue(
                new Error('Update failed')
            );

            await expect(
                bookReviewsService.updateBookReview(
                    updateBookReviewInput,
                    mockUserId
                )
            ).rejects.toThrow('Failed to update the review: Update failed');
        });
    });

    describe('deleteBookReview', () => {
        it('should delete a book review successfully', async () => {
            jest.spyOn(dynamoDBService, 'deleteItem').mockResolvedValue(
                undefined
            );

            const result = await bookReviewsService.deleteBookReview(
                mockReviews[0].reviewId,
                mockUserId
            );

            expect(result).toBe(
                `Review with ID ${mockReviews[0].reviewId} deleted successfully`
            );
            expect(redisService.deleteAllBookReviewsCache).toHaveBeenCalled();
            expect(dynamoDBService.deleteItem).toHaveBeenCalledWith(
                DynamoTables.BOOK_REVIEWS,
                { reviewId: mockReviews[0].reviewId }
            );
        });

        it('should throw an error if deletion fails', async () => {
            jest.spyOn(dynamoDBService, 'deleteItem').mockRejectedValue(
                new Error('Deletion failed')
            );

            await expect(
                bookReviewsService.deleteBookReview(
                    mockReviews[0].reviewId,
                    mockUserId
                )
            ).rejects.toThrow('Failed to delete the review: Deletion failed');
        });
    });
});
