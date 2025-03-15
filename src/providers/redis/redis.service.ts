import { Injectable } from '@nestjs/common';
import { BookReviewDto } from '@book-reviews/dto';
import { GetBooksInput, GetBooksResponseDto } from '@book/dto';
import { REDIS_BOOKS_CACHE_TTL } from './redis-ttl.const';
import { RedisKeyName } from './redis-key-name.enum';
import { RedisDefaultService } from './redis-default.service';
import { generateBooksCacheKey } from './utils/generateBooksCacheKey';

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

    async getBookPagesCache(
        input?: GetBooksInput
    ): Promise<GetBooksResponseDto | null> {
        try {
            const key = generateBooksCacheKey(input);
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
            const key = generateBooksCacheKey(input);
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

    async clearAllBookPagesCache(): Promise<void> {
        const keys: string[] = await this.redisDefaultService.getSet(
            RedisKeyName.BOOKS_PAGINATION
        );

        if (keys.length > 0) await this.redisDefaultService.delMultiple(keys);

        await this.redisDefaultService.del(RedisKeyName.BOOKS_PAGINATION);
    }

    private async trackBookPageCache(key: string): Promise<void> {
        await this.redisDefaultService.setAdd(
            RedisKeyName.BOOKS_PAGINATION,
            key
        );
    }
}
