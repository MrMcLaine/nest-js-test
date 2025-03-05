import { Injectable } from '@nestjs/common';
import { BookReviewDto } from '@book-reviews/dto/book-review.dto';
import { GetBooksInput } from '@book/dto/get-books-input.dto';
import { GetBooksResponseDto } from '@book/dto/get-books-response.dto';
import { RedisDefaultService } from './redis-default.service';
import { REDIS_BOOKS_CACHE_TTL } from '@redis/redis-ttl.const';
import { RedisKeyName } from './redis-key-name.enum';
import { getBooksPageKey } from '@redis/utils/getBooksPageKey';

@Injectable()
export class RedisService {
    private readonly bookCacheKeys: Set<string> = new Set();

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

    async getBookPagesCache(
        input?: GetBooksInput
    ): Promise<GetBooksResponseDto | null> {
        try {
            const key = getBooksPageKey(input);
            await this.trackBookPageCache(key);

            return await this.redisDefaultService.get<GetBooksResponseDto>(key);
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

    async setBookPagesCache(
        response: GetBooksResponseDto,
        input?: GetBooksInput
    ): Promise<void> {
        try {
            const key = getBooksPageKey(input);
            await this.redisDefaultService.set(
                key,
                response,
                REDIS_BOOKS_CACHE_TTL
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

    async clearAllBookPagesCache() {
        console.log('Clearing all cached book pages...');
        for (const key of this.bookCacheKeys) {
            await this.redisDefaultService.del(key);
        }
        this.bookCacheKeys.clear(); // Reset tracking
    }

    private async trackBookPageCache(key: string) {
        this.bookCacheKeys.add(key);
    }
}
