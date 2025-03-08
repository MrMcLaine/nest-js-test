import { DEFAULT_LIMIT_PER_PAGE } from '@book/constants';
import { GetBooksInput } from '@book/dto';

interface LimitOffset {
    limit: number;
    offset: number;
}

export const calculatePaginationParams = (
    input?: GetBooksInput
): LimitOffset => {
    return {
        limit: input?.limit ?? DEFAULT_LIMIT_PER_PAGE,
        offset: input?.offset ?? 0,
    };
};
