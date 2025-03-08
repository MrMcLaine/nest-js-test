import { GetBooksInput } from '@book/dto/get-books-input.dto';
import { calculatePaginationParams } from '@book/utils/calculatePaginationParams';
import { RedisKeyName } from '../redis-key-name.enum';

export const generateBooksCacheKey = (input?: GetBooksInput): string => {
    const { limit, offset } = calculatePaginationParams(input);

    return `${RedisKeyName.BOOKS_PAGINATION}_${limit}_${offset}`;
};
