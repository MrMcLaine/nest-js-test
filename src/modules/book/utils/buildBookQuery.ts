import { SelectQueryBuilder } from 'typeorm';
import { SortOrder } from '@common/enums';
import { Book } from '@book/book.entity';
import { calculatePaginationParams } from '@book/utils';
import { GetBooksInput } from '@book/dto';

export const buildBookQuery = (
    queryBuilder: SelectQueryBuilder<Book>,
    filters: GetBooksInput
): SelectQueryBuilder<Book> => {
    if (filters.title) {
        queryBuilder.andWhere('book.title ILIKE :title', {
            title: `%${filters.title}%`,
        });
    }

    if (filters.author) {
        queryBuilder.andWhere('book.author ILIKE :author', {
            author: `%${filters.author}%`,
        });
    }

    if (filters.publicationYear) {
        queryBuilder.andWhere('book.publicationYear = :year', {
            year: filters.publicationYear,
        });
    }

    if (filters.sortField) {
        queryBuilder.orderBy(
            `book.${filters.sortField}`,
            filters.sortOrder ?? SortOrder.ASC
        );
    }

    const { limit, offset } = calculatePaginationParams(filters);

    queryBuilder.limit(limit + 1);
    queryBuilder.offset(offset);

    return queryBuilder;
};
