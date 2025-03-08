import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDynamoDBClient } from '@config';
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
