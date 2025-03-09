import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb';

export const dynamoDbTableInitParams: Record<string, CreateTableCommandInput> =
    {
        userActivityLogs: {
            TableName: 'user_activity_logs',
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'userId', AttributeType: 'S' },
            ],
            KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
            BillingMode: 'PAY_PER_REQUEST',
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'UserIdIndex',
                    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
                    Projection: { ProjectionType: 'ALL' },
                },
            ],
        },
        bookReviews: {
            TableName: 'book_reviews',
            AttributeDefinitions: [
                { AttributeName: 'reviewId', AttributeType: 'S' },
                { AttributeName: 'bookId', AttributeType: 'S' },
                { AttributeName: 'userId', AttributeType: 'S' },
            ],
            KeySchema: [{ AttributeName: 'reviewId', KeyType: 'HASH' }],
            BillingMode: 'PAY_PER_REQUEST',
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'BookIdIndex',
                    KeySchema: [{ AttributeName: 'bookId', KeyType: 'HASH' }],
                    Projection: { ProjectionType: 'ALL' },
                },
                {
                    IndexName: 'UserIdIndex',
                    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
                    Projection: { ProjectionType: 'ALL' },
                },
            ],
        },
    };
