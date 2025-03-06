import { RedisService } from '@redis/redis.service';

export const mockRedisService = {
    getBookPagesCache: jest.fn(),
    setBookPagesCache: jest.fn(),
    clearAllBookPagesCache: jest.fn(),
    getAllBookReviewsFromCache: jest.fn(),
    setAllBookReviewsToCache: jest.fn(),
    deleteAllBookReviewsCache: jest.fn(),
};

export const mockRedisProvider = {
    provide: RedisService,
    useValue: mockRedisService,
};
