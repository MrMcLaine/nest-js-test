export const bookErrors = {
    failedToGetBooks: 'Failed to get books: DB error',
    failedToCreateBook: 'Failed to create book: DB error',
    failedToUpdateBook: (id: number) =>
        `Failed to update book: Book with ID ${id} not found`,
    failedToDeleteBook: (id: number) =>
        `Failed to delete book: Book with ID ${id} not found`,
};
