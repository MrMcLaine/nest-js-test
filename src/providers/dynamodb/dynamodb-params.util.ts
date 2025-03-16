import {
    QueryCommandInput,
    DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { DYNAMO_DB_TABLE_NAME } from '@common/constants';

export const buildQueryByPKParams = (
    pk: string,
    skPrefix?: string
): QueryCommandInput => ({
    TableName: DYNAMO_DB_TABLE_NAME,
    KeyConditionExpression: skPrefix
        ? 'PK = :pk AND begins_with(SK, :skPrefix)'
        : 'PK = :pk',
    ExpressionAttributeValues: {
        ':pk': pk,
        ...(skPrefix && { ':skPrefix': skPrefix }),
    },
});

export const buildQueryByGSIParams = (
    indexName: string,
    key: string,
    value: string
): QueryCommandInput => ({
    TableName: DYNAMO_DB_TABLE_NAME,
    IndexName: indexName,
    KeyConditionExpression: `${key} = :value`,
    ExpressionAttributeValues: {
        ':value': value,
    },
});

export const buildDeleteParams = (
    pk: string,
    sk: string
): DeleteCommandInput => ({
    TableName: DYNAMO_DB_TABLE_NAME,
    Key: { PK: pk, SK: sk },
});
