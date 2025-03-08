interface GenerateReviewId {
    bookId: string;
    userId: string;
}

export const generateReviewId = (input: GenerateReviewId): string => {
    return `${input.userId}_${input.bookId}`;
};
