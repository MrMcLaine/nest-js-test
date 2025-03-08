import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CreateTableCommand,
    ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    ScanCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/QueryCommand';
import { getDynamoDBClient, dynamoDbTableInitParams } from '@config';
import { DynamoTables } from '@common/enums';
import { dynamodbConditionalErrorHandle } from '@common/errors';
import { convertToUpdateCommandInput } from '@common/utils';
import { UpdateDynamodbItemInput } from '@common/types';

@Injectable()
export class DynamoDBService implements OnModuleInit {
    private readonly logger = new Logger(DynamoDBService.name);
    private dynamoDBClient: DynamoDBDocumentClient;

    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService
    ) {
        this.dynamoDBClient = getDynamoDBClient(this.configService);
    }

    async onModuleInit() {
        try {
            await this.testConnection();
            await this.createTable('userActivityLogs');
            await this.createTable('bookReviews');
            this.logger.log('✅ Successfully connected to DynamoDB');
        } catch (error) {
            this.logger.error('❌ Failed to connect to DynamoDB', error);
        }
    }

    async queryTable<T>(
        tableName: DynamoTables,
        key: Record<string, any>
    ): Promise<T[]> {
        try {
            const params: QueryCommandInput = {
                TableName: tableName,
                IndexName: 'UserIdIndex',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': key.userId,
                },
            };

            const result = await this.dynamoDBClient.send(
                new QueryCommand(params)
            );

            return result.Items ? (result.Items as T[]) : [];
        } catch (error) {
            console.error(
                `Failed to query table ${tableName}: ${error.message}`
            );
            return [];
        }
    }

    async scanTable<T>(tableName: DynamoTables): Promise<T[]> {
        try {
            const params = { TableName: tableName };
            const result = await this.dynamoDBClient.send(
                new ScanCommand(params)
            );

            return (result.Items as T[]) || [];
        } catch (error) {
            throw new Error(`Failed to scan table: ${error.message}`);
        }
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
            const params = convertToUpdateCommandInput(input);

            const result = await this.dynamoDBClient.send(
                new UpdateCommand(params)
            );

            return result.Attributes;
        } catch (error) {
            dynamodbConditionalErrorHandle(error);
        }
    }

    async deleteItem(
        tableName: DynamoTables,
        key: Record<string, any>
    ): Promise<void> {
        try {
            const params = { TableName: tableName, Key: key };
            await this.dynamoDBClient.send(new DeleteCommand(params));
        } catch (error) {
            throw new Error(`Failed to delete item: ${error.message}`);
        }
    }

    private async createTable(
        tableKey: keyof typeof dynamoDbTableInitParams
    ): Promise<void> {
        try {
            const params = dynamoDbTableInitParams[tableKey];
            await this.dynamoDBClient.send(new CreateTableCommand(params));
            console.log(`✅ Table '${params.TableName}' created successfully`);
        } catch (error) {
            if (error.name === 'ResourceInUseException') {
                console.log(`⚠️ Table '${tableKey}' already exists.`);
            } else {
                console.error(
                    `❌ Failed to create table '${tableKey}': ${error.message}`
                );
            }
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
