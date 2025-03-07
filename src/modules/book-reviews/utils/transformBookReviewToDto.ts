import { generateReviewId } from './generateBookReviewId';
import { CreateBookReviewInput } from '@book-reviews/dto';
import { BookReview } from '../types/book-review.type';

export const transformBookReviewToDto = (
    userId: string,
    data: CreateBookReviewInput
): BookReview => {
    const reviewId = generateReviewId({
        bookId: data.bookId,
        userId,
    });

    return {
        reviewId,
        bookId: data.bookId,
        userId: userId,
        rating: data.rating,
        reviewText: data.reviewText ?? null,
        createdAt: new Date().toISOString(),
    };
};
