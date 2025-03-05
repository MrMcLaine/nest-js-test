import { UpdateDynamodbItemInput } from '@common/types/update-dynamodb-item-input.type';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { UpdateBookReviewInput } from '../dto/update-book-review-input.dto';

export const toUpdateDynamodbItemInputByReview = (
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
