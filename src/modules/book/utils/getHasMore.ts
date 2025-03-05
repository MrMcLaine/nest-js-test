import { Book } from '@book/book.entity';
import { getLimitOffset } from '@book/utils/getLimitOffset';
import { GetBooksInput } from '@book/dto/get-books-input.dto';

interface GetHasMoreResponse {
    hasMore: boolean;
    data: Book[];
}

export const getHasMore = (
    items: Book[],
    filters?: GetBooksInput
): GetHasMoreResponse => {
    const { limit } = getLimitOffset(filters);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;

    return { hasMore, data };
};
