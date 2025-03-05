import { DynamoTables } from '@common/enums/dynamo-tables.enum';

export interface UpdateDynamodbItemInput {
    tableName: DynamoTables;
    key: Record<string, any>;
    updates: Record<string, any>;
    conditionExpression?: string;
}
