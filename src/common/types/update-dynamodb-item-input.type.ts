import { DynamoTables } from '@common/enums';

export interface UpdateDynamodbItemInput {
    tableName: DynamoTables;
    key: Record<string, any>;
    updates: Record<string, any>;
    conditionExpression?: string;
}
