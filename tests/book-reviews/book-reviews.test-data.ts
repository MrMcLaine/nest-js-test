import { CreateBookReviewInput } from '@book-reviews/dto/create-book-review-input.dto';
import { UpdateBookReviewInput } from '@book-reviews/dto/update-book-review-input.dto';

export const mockReviews = [
    {
        reviewId: '1',
        bookId: 2,
        userId: 1,
        rating: 5,
        reviewText: 'Great!',
        createdAt: new Date().toISOString(),
    },
];

export const createBookReviewInput: CreateBookReviewInput = {
    bookId: 2,
    rating: 5,
    reviewText: 'Amazing book!',
};

export const updateBookReviewInput: UpdateBookReviewInput = {
    reviewId: '1',
    rating: 4,
    reviewText: 'Updated review',
};

export const mockUserId = 1;
