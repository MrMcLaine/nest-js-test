export interface BookReview {
    reviewId: string;
    bookId: string;
    userId: string;
    rating: number;
    reviewText?: string;
    createdAt: string;
}
