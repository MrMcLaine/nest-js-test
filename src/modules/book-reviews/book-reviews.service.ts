import { Injectable } from '@nestjs/common';
import { RedisService } from '@providers/redis/redis.service';
import { BookReviewsRepository } from '@book-reviews/book-reviews.repository';
import {
    CreateBookReviewInput,
    BookReviewDto,
    UpdateBookReviewInput,
} from '@book-reviews/dto';

@Injectable()
export class BookReviewsService {
    constructor(
        private readonly bookReviewsRepository: BookReviewsRepository,
        private readonly redisService: RedisService
    ) {}

    async getAllBookReviews(): Promise<BookReviewDto[]> {
        try {
            const reviewCached =
                await this.redisService.getAllBookReviewsFromCache();

            if (reviewCached) return reviewCached;

            const reviews =
                await this.bookReviewsRepository.getAllBookReviews();
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
            const review = await this.bookReviewsRepository.createBookReview(
                data,
                userId
            );
            await this.redisService.deleteAllBookReviewsCache();

            return review;
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

            const updatedReview =
                await this.bookReviewsRepository.updateBookReview({
                    bookId: data.bookId,
                    userId,
                    updates: {
                        rating: data.rating,
                        reviewText: data.reviewText,
                    },
                });

            await this.redisService.deleteAllBookReviewsCache();

            return updatedReview;
        } catch (error) {
            throw new Error(`Failed to update the review: ${error.message}`);
        }
    }

    async deleteBookReview(bookId: string, userId: string): Promise<string> {
        try {
            await this.checkBookReviewOwner({ userId, bookId });
            await this.bookReviewsRepository.deleteBookReview({
                bookId,
                userId,
            });
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
        const review =
            await this.bookReviewsRepository.getBookReviewByUser(input);

        if (!review) {
            throw new Error('You are not the owner of this book review');
        }
    }
}
