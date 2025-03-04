import { Book } from '@book/book.entity';
import { DEFAULT_LIMIT_PER_PAGE } from '@book/constants/other';

interface GetHasMoreResponse {
    hasMore: boolean;
    data: Book[];
}

export const getHasMore = (
    items: Book[],
    limit?: number
): GetHasMoreResponse => {
    const limitNumber = limit ? limit : DEFAULT_LIMIT_PER_PAGE;

    const hasMore = items.length > limitNumber;
    const data = hasMore ? items.slice(0, limitNumber) : items;

    return { hasMore, data };
};
