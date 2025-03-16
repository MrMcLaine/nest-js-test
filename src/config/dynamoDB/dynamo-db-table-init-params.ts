import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb';
import { DYNAMO_DB_TABLE_NAME } from '@common/constants/dynamo-db-table-name';

export const dynamoDbTableInitParams: CreateTableCommandInput = {
    TableName: DYNAMO_DB_TABLE_NAME,
    AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'EntityType', AttributeType: 'S' },
    ],
    KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
        {
            IndexName: 'EntityTypeIndex',
            KeySchema: [{ AttributeName: 'EntityType', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
        },
    ],
};
