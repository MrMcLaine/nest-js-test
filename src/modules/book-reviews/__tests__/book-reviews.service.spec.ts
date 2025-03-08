import { Test, TestingModule } from '@nestjs/testing';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { DynamoDBService } from '@dynamodb/dynamodb.service';
import { RedisService } from '@redis/redis.service';
import { mockUser } from '@user/__tests__/user.test-data';
import { BookReviewsService } from '@book-reviews/book-reviews.service';
import { checkBookReviewOwner } from '@book-reviews/utils/check-book-review-owner.util';
import * as bookReviewUtils from '@book-reviews/utils/transformBookReviewToDto';
import * as updateUtils from '@book-reviews/utils/toUpdateDynamodbItemInputByReview';
import {
    createBookReviewInput_1,
    mockReview,
    mockReviews,
    updateBookReviewInput,
} from '@book-reviews/__tests__/book-reviews.test-data';
import { dynamodbMock } from '../../../test-utils/mocks/dynamodb.mock';
import { mockRedisProvider } from '../../../test-utils/mocks/redis.mock';

jest.mock('@book-reviews/utils/check-book-review-owner.util');

describe('BookReviewsService', () => {
    let bookReviewsService: BookReviewsService;
    let dynamoDBService: DynamoDBService;
    let redisService: RedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookReviewsService, dynamodbMock, mockRedisProvider],
        }).compile();

        bookReviewsService = module.get<BookReviewsService>(BookReviewsService);
        dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
        redisService = module.get<RedisService>(RedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllBookReviews', () => {
        it('should return cached book reviews', async () => {
            jest.spyOn(
                redisService,
                'getAllBookReviewsFromCache'
            ).mockResolvedValue(mockReviews);

            const result = await bookReviewsService.getAllBookReviews();

            expect(result).toEqual(mockReviews);
            expect(redisService.getAllBookReviewsFromCache).toHaveBeenCalled();
            expect(dynamoDBService.scanTable).not.toHaveBeenCalled();
        });

        it('should return book reviews from DynamoDB if not cached', async () => {
            jest.spyOn(
                redisService,
                'getAllBookReviewsFromCache'
            ).mockResolvedValue(null);
            jest.spyOn(dynamoDBService, 'scanTable').mockResolvedValue(
                mockReviews
            );

            const result = await bookReviewsService.getAllBookReviews();

            expect(result).toEqual(mockReviews);
            expect(dynamoDBService.scanTable).toHaveBeenCalledWith(
                DynamoTables.BOOK_REVIEWS
            );
            expect(redisService.setAllBookReviewsToCache).toHaveBeenCalledWith(
                mockReviews
            );
        });

        it('should throw an error if fetching reviews fails', async () => {
            jest.spyOn(dynamoDBService, 'scanTable').mockRejectedValue(
                new Error('DB error')
            );

            await expect(
                bookReviewsService.getAllBookReviews()
            ).rejects.toThrow('Failed to retrieve book reviews: DB error');
        });
    });

    describe('createBookReview', () => {
        it('should create a book review successfully', async () => {
            jest.spyOn(
                redisService,
                'deleteAllBookReviewsCache'
            ).mockResolvedValue(undefined);
            jest.spyOn(dynamoDBService, 'putItem').mockResolvedValue(undefined);
            jest.spyOn(bookReviewUtils, 'transformBookReviewToDto').mockReturnValue(
                mockReview
            );

            const result = await bookReviewsService.createBookReview(
                createBookReviewInput_1,
                mockUser.id
            );

            expect(result).toEqual(mockReview);
            expect(redisService.deleteAllBookReviewsCache).toHaveBeenCalled();
            expect(dynamoDBService.putItem).toHaveBeenCalledWith(
                DynamoTables.BOOK_REVIEWS,
                mockReview
            );
        });

        it('should throw an error if creating a book review fails', async () => {
            jest.spyOn(dynamoDBService, 'putItem').mockRejectedValue(
                new Error('DB error')
            );

            await expect(
                bookReviewsService.createBookReview(
                    createBookReviewInput_1,
                    mockUser.id
                )
            ).rejects.toThrow('Failed to create the review: DB error');
        });
    });

    describe('updateBookReview', () => {
        it('should update a book review successfully', async () => {
            const expectedUpdateInput = {
                tableName: DynamoTables.BOOK_REVIEWS,
                key: { reviewId: '1' },
                updates: { rating: 4, reviewText: 'Updated content' },
            };

            jest.spyOn(
                updateUtils,
                'toUpdateDynamodbItemInputByReview'
            ).mockReturnValue(expectedUpdateInput);
            jest.spyOn(dynamoDBService, 'updateItem').mockResolvedValue(
                expectedUpdateInput
            );

            const result = await bookReviewsService.updateBookReview(
                updateBookReviewInput,
                mockUser.id
            );

            expect(result).toEqual(expectedUpdateInput);

            expect(checkBookReviewOwner).toHaveBeenCalledWith({
                userId: mockUser.id,
                reviewId: updateBookReviewInput.reviewId,
            });

            expect(redisService.deleteAllBookReviewsCache).toHaveBeenCalled();

            expect(
                updateUtils.toUpdateDynamodbItemInputByReview
            ).toHaveBeenCalledWith(updateBookReviewInput);

            expect(dynamoDBService.updateItem).toHaveBeenCalledWith(
                expectedUpdateInput
            );
        });

        it('should throw an error if updating a book review fails', async () => {
            jest.spyOn(dynamoDBService, 'updateItem').mockRejectedValue(
                new Error('DB error')
            );

            await expect(
                bookReviewsService.updateBookReview(
                    updateBookReviewInput,
                    mockUser.id
                )
            ).rejects.toThrow('Failed to update the review: DB error');
        });
    });

    describe('deleteBookReview', () => {
        it('should delete a book review successfully', async () => {
            jest.spyOn(dynamoDBService, 'deleteItem').mockResolvedValue(
                undefined
            );

            const result = await bookReviewsService.deleteBookReview(
                mockReviews[0].reviewId,
                mockReviews[0].userId
            );

            expect(result).toBe(
                `Review with ID ${mockReviews[0].reviewId} deleted successfully`
            );
            expect(checkBookReviewOwner).toHaveBeenCalledWith({
                userId: mockReviews[0].userId,
                reviewId: mockReviews[0].reviewId,
            });
            expect(redisService.deleteAllBookReviewsCache).toHaveBeenCalled();
            expect(dynamoDBService.deleteItem).toHaveBeenCalledWith(
                DynamoTables.BOOK_REVIEWS,
                { reviewId: mockReviews[0].reviewId }
            );
        });

        it('should throw an error if deleting a book review fails', async () => {
            jest.spyOn(dynamoDBService, 'deleteItem').mockRejectedValue(
                new Error('DB error')
            );

            await expect(
                bookReviewsService.deleteBookReview('1', 1)
            ).rejects.toThrow('Failed to delete the review: DB error');
        });
    });
});
