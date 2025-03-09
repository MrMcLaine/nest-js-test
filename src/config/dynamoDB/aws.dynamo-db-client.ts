import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const getDynamoDBClient = (configService: ConfigService) => {
    const isLocal =
        configService.get<string>('NODE_ENV', 'development') === 'development';

    return DynamoDBDocumentClient.from(
        new DynamoDBClient({
            region: configService.get<string>('AWS_REGION', 'us-east-1'),
            endpoint: configService.get<string>(
                'DYNAMODB_ENDPOINT',
                'http://dynamodb-local:8000' // ✅ Make sure this matches Docker service name
            ),
            credentials: isLocal
                ? undefined // ✅ No credentials needed for DynamoDB Local
                : {
                      accessKeyId: configService.get<string>(
                          'AWS_ACCESS_KEY_ID',
                          'default_access_key'
                      ),
                      secretAccessKey: configService.get<string>(
                          'AWS_SECRET_ACCESS_KEY',
                          'default_secret_key'
                      ),
                  },
        })
    );
};
