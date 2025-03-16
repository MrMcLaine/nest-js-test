export interface BookReview {
    PK: string;
    SK: string;
    bookId: string;
    userId: string;
    rating: number;
    reviewText?: string;
    createdAt: string;
    EntityType: 'REVIEW';
}
