import { Book } from '@book/book.entity';
import { BookDto } from '@book/dto/book-dto';

export const transformBookToDto = (book: Book): BookDto => {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        publicationYear: book.publicationYear,
        description: book.description,
    };
};
