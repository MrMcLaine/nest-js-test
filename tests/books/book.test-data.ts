import { CreateBookInput } from '@book/dto';

export const MOCK_BOOK = {
    title: 'Integration Test Book',
    author: 'Integration Author',
    publicationYear: 2020,
    description: 'Integration Test Book Description',
};

export const VALID_CREATE_BOOK_DATA: CreateBookInput = {
    ...MOCK_BOOK,
};

export const INVALID_CREATE_BOOK_DATA = {
    title: 'Incomplete Book',
} as CreateBookInput;

export const VALID_UPDATE_BOOK_TITLE = 'Updated Book Title';
export const NO_EXISTING_BOOK_ID = 'invalid_id';

export const INVALID_UPDATE_BOOK_DATA = {
    id: NO_EXISTING_BOOK_ID,
    title: 'Updated Book Title',
}