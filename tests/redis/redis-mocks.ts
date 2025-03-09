import { RedisService } from '@providers/redis/redis.service';
import { GetBooksResponseDto } from '@book/dto';

export const getBooksNoFilterMock = (
    cachedBooks: GetBooksResponseDto | null,
    redisService: RedisService
) => {
    return jest
        .spyOn(redisService, 'getBookPagesCache')
        .mockResolvedValue(cachedBooks);
};