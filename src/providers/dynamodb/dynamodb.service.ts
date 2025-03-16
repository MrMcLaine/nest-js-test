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
    UpdateCommand,
    UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient, dynamoDbTableInitParams } from '@config';
import { DYNAMO_DB_TABLE_NAME } from '@common/constants';
import { dynamodbConditionalErrorHandle } from '@common/errors';
import {
    buildDeleteParams,
    buildQueryByGSIParams,
    buildQueryByPKParams,
} from '@providers/dynamodb/dynamodb-params.util';

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
            await this.createTable();
            this.logger.log('✅ Successfully connected to DynamoDB');
        } catch (error) {
            this.logger.error('❌ Failed to connect to DynamoDB', error);
        }
    }

    async queryByPK<T>(pk: string, skPrefix?: string): Promise<T[]> {
        try {
            const params = buildQueryByPKParams(pk, skPrefix);
            const result = await this.dynamoDBClient.send(
                new QueryCommand(params)
            );

            return result.Items ? (result.Items as T[]) : [];
        } catch (error) {
            console.error(
                `Failed to query items with PK '${pk}': ${error.message}`
            );
            return [];
        }
    }

    async queryByGSI<T>(
        indexName: string,
        key: string,
        value: string
    ): Promise<T[]> {
        try {
            const params = buildQueryByGSIParams(indexName, key, value);
            const result = await this.dynamoDBClient.send(
                new QueryCommand(params)
            );

            return result.Items ? (result.Items as T[]) : [];
        } catch (error) {
            console.error(
                `Failed to query GSI '${indexName}' with key '${key}': ${error.message}`
            );
            return [];
        }
    }

    async putItem(item: Record<string, any>): Promise<void> {
        try {
            const params = { TableName: DYNAMO_DB_TABLE_NAME, Item: item };
            await this.dynamoDBClient.send(new PutCommand(params));
            console.log(
                `✅ Successfully inserted item into ${DYNAMO_DB_TABLE_NAME}:`,
                item
            );
        } catch (error) {
            console.error(
                `❌ Failed to put item into ${DYNAMO_DB_TABLE_NAME}:`,
                error
            );
            throw new Error(`Failed to put item: ${error.message}`);
        }
    }

    async updateItem(input: UpdateCommandInput): Promise<any> {
        try {
            const result = await this.dynamoDBClient.send(
                new UpdateCommand(input)
            );
            return result.Attributes;
        } catch (error) {
            dynamodbConditionalErrorHandle(error);
        }
    }

    async deleteItem(pk: string, sk: string): Promise<void> {
        try {
            const params = buildDeleteParams(pk, sk);
            await this.dynamoDBClient.send(new DeleteCommand(params));
        } catch (error) {
            throw new Error(`Failed to delete item: ${error.message}`);
        }
    }

    private async createTable(): Promise<void> {
        try {
            await this.dynamoDBClient.send(
                new CreateTableCommand(dynamoDbTableInitParams)
            );
            console.log(
                `✅ Table '${dynamoDbTableInitParams.TableName}' created successfully`
            );
        } catch (error) {
            if (error.name === 'ResourceInUseException') {
                console.log(
                    `⚠️ Table '${dynamoDbTableInitParams.TableName}' already exists.`
                );
            } else {
                console.error(
                    `❌ Failed to create table '${dynamoDbTableInitParams.TableName}': ${error.message}`
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
