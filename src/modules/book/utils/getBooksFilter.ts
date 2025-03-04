import { SelectQueryBuilder } from 'typeorm';
import { DEFAULT_LIMIT_PER_PAGE } from '@book/constants/other';
import { Book } from '@book/book.entity';
import { GetBooksInput } from '@book/dto/get-books-input.dto';

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

    if (
        filters.sortField &&
        ['title', 'author', 'publicationYear'].includes(filters.sortField)
    ) {
        const order = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC';
        queryBuilder.orderBy(`book.${filters.sortField}`, order);
    }

    const limit = filters?.limit ?? DEFAULT_LIMIT_PER_PAGE;
    const offset = filters?.offset ?? 0;

    queryBuilder.limit(limit + 1);
    queryBuilder.offset(offset);

    return queryBuilder;
};
