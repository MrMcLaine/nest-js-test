import { Book } from '../book.entity';
import { CreateBookInput } from '../dto/create-book-input.dto';
import { UpdateBookInput } from '../dto/update-book-input.dto';

export const mockBook = {
    id: '1',
    title: 'Mock Book',
    author: 'Test Author',
} as Book;

export const createBookInput: CreateBookInput = {
    title: 'New Test Book',
    author: 'Test Author',
    publicationYear: 2023,
};

export const updateBookInput: UpdateBookInput = {
    id: 1,
    title: 'Updated Book Title',
};

export const mockUpdatedBook = {
    id: '1',
    title: 'Updated Book Title',
} as Book;
