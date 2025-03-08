import { GetBooksInput } from '@book/dto';

export const isCacheable = (input: GetBooksInput): boolean => {
    return (
        !input?.title &&
        !input?.author &&
        !input?.publicationYear &&
        !input?.sortField &&
        !input?.sortOrder
    );
};
