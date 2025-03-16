import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { DYNAMO_DB_TABLE_NAME } from '@common/constants';
import { UpdateDynamodbItemInput } from '@common/types';

export const convertToUpdateCommandInput = (
    input: UpdateDynamodbItemInput
): UpdateCommandInput => {
    if (!input.key || Object.keys(input.key).length === 0) {
        throw new Error('Key is required to update an item.');
    }

    if (!input.updates || Object.keys(input.updates).length === 0) {
        throw new Error('No fields to update.');
    }

    const updateExpressionParts: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    for (const [field, value] of Object.entries(input.updates)) {
        if (value === undefined) continue;
        if (['PK', 'SK', 'EntityType', 'createdAt'].includes(field)) continue; // Запобігаємо зміні ключових полів

        const attributeName = `#${field}`;
        updateExpressionParts.push(`${attributeName} = :${field}`);

        expressionAttributeValues[`:${field}`] = value;
        expressionAttributeNames[attributeName] = field;
    }

    if (input.includeUpdatedAt !== false) {
        updateExpressionParts.push(`#updatedAt = :updatedAt`);
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
    }

    return {
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: input.key,
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames:
            Object.keys(expressionAttributeNames).length > 0
                ? expressionAttributeNames
                : undefined,
        ReturnValues: 'ALL_NEW',
        ...(input.conditionExpression && {
            ConditionExpression: input.conditionExpression,
        }),
    };
};
