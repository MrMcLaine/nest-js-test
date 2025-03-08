export const extractUserIdFromReviewId = (reviewId: string): number => {
    const [userIdFromReviewId] = reviewId.split('_').map(Number);

    return userIdFromReviewId;
};
