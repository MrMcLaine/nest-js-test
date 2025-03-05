import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { UpdateDynamodbItemInput } from '@common/types/update-dynamodb-item-input.type';

export const toUpdateCommandInput = (
    input: UpdateDynamodbItemInput
): UpdateCommandInput => {
    if (!Object.keys(input.updates).length) {
        throw new Error('No fields to update.');
    }

    const updateExpressionParts: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    for (const [field, value] of Object.entries(input.updates)) {
        updateExpressionParts.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = value;
    }

    updateExpressionParts.push(`updatedAt = :updatedAt`);
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    return {
        TableName: input.tableName,
        Key: input.key,
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
        ...(input.conditionExpression
            ? { ConditionExpression: input.conditionExpression }
            : {}),
    };
};
