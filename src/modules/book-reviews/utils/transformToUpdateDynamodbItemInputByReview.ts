import { DynamoTables } from '@common/enums';
import { UpdateDynamodbItemInput } from '@common/types';
import { UpdateBookReviewInput } from '@book-reviews/dto';

export const transformToUpdateDynamodbItemInputByReview = (
    data: UpdateBookReviewInput
): UpdateDynamodbItemInput => {
    const updateFields: Record<string, any> = {};

    if (data.rating !== undefined) {
        updateFields.rating = data.rating;
    }

    if (data.reviewText !== undefined) {
        updateFields.reviewText = data.reviewText;
    }

    return {
        tableName: DynamoTables.BOOK_REVIEWS,
        key: { reviewId: data.reviewId },
        updates: updateFields,
    };
};
