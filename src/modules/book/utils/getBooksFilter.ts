import { SelectQueryBuilder } from 'typeorm';
import { Book } from '@book/book.entity';
import { getLimitOffset } from '@book/utils/getLimitOffset';
import { GetBooksInput } from '@book/dto/get-books-input.dto';
import { SortOrder } from '@common/enums/sort-order.enum';

export const getBookFilters = (
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

    const { limit, offset } = getLimitOffset(filters);

    queryBuilder.limit(limit + 1);
    queryBuilder.offset(offset);

    return queryBuilder;
};
