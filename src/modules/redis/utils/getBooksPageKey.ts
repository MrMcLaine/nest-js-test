import { GetBooksInput } from '@book/dto/get-books-input.dto';
import { getLimitOffset } from '@book/utils/getLimitOffset';
import { RedisKeyName } from '@redis/redis-key-name.enum';

export const getBooksPageKey = (input?: GetBooksInput): string => {
    const { limit, offset } = getLimitOffset(input);

    return `${RedisKeyName.BOOKS_PAGINATION}_${limit}_${offset}`;
};
