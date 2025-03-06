import { DynamoDBService } from '@dynamodb/dynamodb.service';

export const dynamodbMock = {
    provide: DynamoDBService,
    useValue: {
        scanTable: jest.fn(),
        putItem: jest.fn(),
        updateItem: jest.fn(),
        deleteItem: jest.fn(),
    },
};
