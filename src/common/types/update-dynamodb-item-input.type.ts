export interface UpdateDynamodbItemInput {
    key: Record<string, string | number>;
    updates: Record<string, string | number | boolean | null>;
    conditionExpression?: string;
    includeUpdatedAt?: boolean;
}
