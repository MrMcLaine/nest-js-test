import { BookReviewDto } from '@book-reviews/dto/book-review.dto';
import { CreateBookReviewInput } from '@book-reviews/dto/create-book-review-input.dto';
import { mockUser } from '@user/__tests__/user.test-data';
import { UpdateBookReviewInput } from '@book-reviews/dto/update-book-review-input.dto';

export const mockReviews: BookReviewDto[] = [
    {
        reviewId: '1',
        bookId: 1,
        userId: mockUser.id,
        rating: 5,
        createdAt: '2023-01-01',
        reviewText: 'Great book!',
    },
];

export const createBookReviewInput_1: CreateBookReviewInput = {
    bookId: 1,
    rating: 5,
    reviewText: 'Nice book!',
};

export const updateBookReviewInput: UpdateBookReviewInput = {
    reviewId: '1',
    rating: 4,
    reviewText: 'Updated content',
};

export const mockReview = {
    reviewId: '1',
    ...createBookReviewInput_1,
    userId: mockUser.id,
    createdAt: new Date().toISOString(),
};
