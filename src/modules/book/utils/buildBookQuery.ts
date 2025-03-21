import { SelectQueryBuilder } from 'typeorm';
import { SortOrder } from '@common/enums';
import { SortField } from '@book/constants';
import { Book } from '@book/book.entity';
import { calculatePaginationParams } from '@book/utils';
import { GetBooksInput } from '@book/dto';

export const buildBookQuery = (
    queryBuilder: SelectQueryBuilder<Book>,
    filters: GetBooksInput
): SelectQueryBuilder<Book> => {
    if (filters && filters.title) {
        queryBuilder.andWhere('book.title ILIKE :title', {
            title: `%${filters.title}%`,
        });
    }

    if (filters && filters.author) {
        queryBuilder.andWhere('book.author ILIKE :author', {
            author: `%${filters.author}%`,
        });
    }

    if (filters && filters.publicationYear) {
        queryBuilder.andWhere('book.publicationYear = :year', {
            year: filters.publicationYear,
        });
    }

    const sortField = filters.sortField ?? SortField.TITLE;
    const sortOrder = filters.sortOrder ?? SortOrder.ASC;

    queryBuilder.orderBy(`book.${sortField}`, sortOrder);

    const { limit, offset } = calculatePaginationParams(filters);

    queryBuilder.limit(limit + 1);
    queryBuilder.offset(offset);

    return queryBuilder;
};
