export const dynamodbConditionalErrorHandle = (error: any) => {
    if (error.name === 'ConditionalCheckFailedException') {
        throw new Error(
            'Update condition failed - unauthorized or item not found'
        );
    }

    throw new Error(`Failed to update item: ${error.message}`);
};
