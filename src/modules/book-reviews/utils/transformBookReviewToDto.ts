import { generateReviewId } from './generateBookReviewId';
import { CreateBookReviewInput } from '../dto/create-book-review-input.dto';
import { BookReview } from '../types/book-review.type';

export const transformBookReviewToDto = (
    userId: number,
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
