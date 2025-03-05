interface GenerateReviewId {
    bookId: number;
    userId: number;
}

export const generateReviewId = (input: GenerateReviewId): string => {
    return `${input.userId}_${input.bookId}`;
};
