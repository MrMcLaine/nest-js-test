import { Book } from '@book/book.entity';

export interface UpdatedBooksResponse {
    affected: number;
    book: Book | null;
}
