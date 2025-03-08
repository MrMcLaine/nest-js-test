export const extractUserIdFromReviewId = (reviewId: string): string => {
    const parts = reviewId.split('_');

    if (parts.length === 0)
        throw new Error(`Invalid reviewId format: ${reviewId}`);

    return parts[0];
};
