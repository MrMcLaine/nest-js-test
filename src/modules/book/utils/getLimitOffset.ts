import { DEFAULT_LIMIT_PER_PAGE } from '@book/constants/other';
import { GetBooksInput } from '@book/dto/get-books-input.dto';

interface LimitOffset {
    limit: number;
    offset: number;
}

export const getLimitOffset = (input?: GetBooksInput): LimitOffset => {
    return {
        limit: input?.limit ?? DEFAULT_LIMIT_PER_PAGE,
        offset: input?.offset ?? 0,
    };
};
