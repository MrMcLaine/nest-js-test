interface CheckOwnerInput {
    userId: number;
    reviewId: string;
}

export const checkBookReviewOwner = (input: CheckOwnerInput): void => {
    const [userIdFromReviewId] = input.reviewId.split('_').map(Number);

    if (input.userId !== userIdFromReviewId)
        throw new Error(`You are not the owner of this book review`);
};
