import { Injectable } from '@nestjs/common';
import { BookReviewDto } from '@book-reviews/dto/book-review.dto';
import { RedisDefaultService } from './redis-default.service';
import { RedisKeyName } from './redis-key-name.enum';

@Injectable()
export class RedisService {
    constructor(private readonly redisDefaultService: RedisDefaultService) {}

    async getAllBookReviewsFromCache(): Promise<BookReviewDto[]> {
        try {
            return await this.redisDefaultService.get(
                RedisKeyName.ALL_BOOK_REVIEWS
            );
        } catch (error) {
            throw new Error(
                `Failed to get all books from cache: ${error.message}`
            );
        }
    }

    async setAllBookReviewsToCache(books: BookReviewDto[]): Promise<void> {
        try {
            await this.redisDefaultService.set(
                RedisKeyName.ALL_BOOK_REVIEWS,
                books
            );
        } catch (error) {
            throw new Error(
                `Failed to set all books to cache: ${error.message}`
            );
        }
    }

    async deleteAllBookReviewsCache(): Promise<void> {
        try {
            await this.redisDefaultService.del(RedisKeyName.ALL_BOOK_REVIEWS);
        } catch (error) {
            throw new Error(
                `Failed to delete all books from cache: ${error.message}`
            );
        }
    }
}
