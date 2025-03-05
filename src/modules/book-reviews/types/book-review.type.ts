export interface BookReview {
    reviewId: string;
    bookId: number;
    userId: number;
    rating: number;
    reviewText?: string;
    createdAt: string;
}
