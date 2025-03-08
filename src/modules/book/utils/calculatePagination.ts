import { Book } from '@book/book.entity';
import { calculatePaginationParams } from '@book/utils';
import { GetBooksInput } from '@book/dto';

interface GetHasMoreResponse {
    hasMore: boolean;
    data: Book[];
}

export const calculatePagination = (
    items: Book[],
    filters?: GetBooksInput
): GetHasMoreResponse => {
    const { limit } = calculatePaginationParams(filters);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;

    return { hasMore, data };
};
