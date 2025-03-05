import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '@config/aws.dynamo-db-client';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { dynamodbConditionalErrorHandle } from '@common/errors/dynamodb-conditional-error-handle.util';
import { toUpdateCommandInput } from '@common/utils/toUpdateCommandInput';
import { UpdateDynamodbItemInput } from '@common/types/update-dynamodb-item-input.type';

@Injectable()
export class DynamoDBService implements OnModuleInit {
    private readonly logger = new Logger(DynamoDBService.name);
    private dynamoDBClient: DynamoDBDocumentClient;

    constructor() {
        this.dynamoDBClient = DynamoDBDocumentClient.from(getDynamoDBClient);
    }

    async onModuleInit() {
        try {
            await this.testConnection();
            this.logger.log('✅ Successfully connected to DynamoDB');
        } catch (error) {
            this.logger.error('❌ Failed to connect to DynamoDB', error);
        }
    }

    async getItem(
        tableName: DynamoTables,
        key: Record<string, any>
    ): Promise<any> {
        const params = { TableName: tableName, Key: key };
        return this.dynamoDBClient.send(new GetCommand(params));
    }

    async putItem(
        tableName: DynamoTables,
        item: Record<string, any>
    ): Promise<void> {
        const params = { TableName: tableName, Item: item };
        await this.dynamoDBClient.send(new PutCommand(params));
    }

    async updateItem(input: UpdateDynamodbItemInput): Promise<any> {
        try {
            const params = toUpdateCommandInput(input);

            const result = await this.dynamoDBClient.send(
                new UpdateCommand(params)
            );

            return result.Attributes;
        } catch (error) {
            dynamodbConditionalErrorHandle(error);
        }
    }

    private async testConnection(): Promise<void> {
        try {
            await this.dynamoDBClient.send(new ListTablesCommand({}));
            this.logger.log('✅ DynamoDB is reachable');
        } catch (error) {
            throw new Error(`DynamoDB connection error: ${error.message}`);
        }
    }
}
