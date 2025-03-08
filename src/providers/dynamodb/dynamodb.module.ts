import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDynamoDBClient } from '@config/dynamoDB/aws.dynamo-db-client';
import { DynamoDBService } from './dynamodb.service';

@Global()
@Module({
    providers: [
        {
            provide: 'DYNAMODB_CLIENT',
            useFactory: (configService: ConfigService) =>
                getDynamoDBClient(configService),
            inject: [ConfigService],
        },
        DynamoDBService,
    ],
    exports: ['DYNAMODB_CLIENT', DynamoDBService],
})
export class DynamodbModule {}
