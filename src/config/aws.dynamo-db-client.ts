import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';

export const getDynamoDBClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({
        region: process.env.AWS_REGION!,
        credentials: fromIni(),
        // credentials: {
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        // },
    })
);
