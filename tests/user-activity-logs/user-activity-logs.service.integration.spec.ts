import { TestingModule } from '@nestjs/testing';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { UserActivityLogsService } from '@user-activity-log/user-activity-logs.service';
import { createTestModule } from '../config/db.test.module';
import { mockUserId } from '../book-reviews/book-reviews.test-data';
import { failedMockLog, mockLogs } from './user-activity-logs.test-data';

describe('UserActivityLogsService (Integration)', () => {
    let userActivityLogsService: UserActivityLogsService;
    let dynamoDBService: DynamoDBService;

    beforeAll(async () => {
        const module: TestingModule = await createTestModule();

        userActivityLogsService = module.get<UserActivityLogsService>(
            UserActivityLogsService
        );
        dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
    });

    afterAll(async () => {
        jest.clearAllMocks();
    });

    describe('getUserActivityLogs', () => {
        it('should return user activity logs successfully', async () => {
            jest.spyOn(dynamoDBService, 'queryTable').mockResolvedValue(
                mockLogs
            );

            const result =
                await userActivityLogsService.getUserActivityLogs(mockUserId);

            expect(result).toEqual(mockLogs);
            expect(dynamoDBService.queryTable).toHaveBeenCalledWith(
                DynamoTables.USER_ACTIVITY_LOGS,
                { userId: mockUserId }
            );
        });

        it('should throw an error if DynamoDB query fails', async () => {
            jest.spyOn(dynamoDBService, 'queryTable').mockRejectedValue(
                new Error('DynamoDB query failed')
            );

            await expect(
                userActivityLogsService.getUserActivityLogs('1')
            ).rejects.toThrow(
                'Failed to get user activity logs: DynamoDB query failed'
            );
        });
    });

    describe('createUserActivityLog', () => {
        it('should create a user activity log successfully', async () => {
            jest.spyOn(dynamoDBService, 'putItem').mockResolvedValue(undefined);

            await userActivityLogsService.createUserActivityLog(mockLogs[0]);

            expect(dynamoDBService.putItem).toHaveBeenCalledWith(
                DynamoTables.USER_ACTIVITY_LOGS,
                expect.objectContaining({
                    userId: mockLogs[0].userId,
                    operationName: mockLogs[0].operationName,
                    date: mockLogs[0].date,
                    id: expect.any(String),
                })
            );
        });

        it('should throw an error if inserting user activity log fails', async () => {
            jest.spyOn(dynamoDBService, 'putItem').mockRejectedValue(
                new Error('DynamoDB insertion failed')
            );

            await expect(
                userActivityLogsService.createUserActivityLog(failedMockLog)
            ).rejects.toThrow(
                'Failed to create new user activity log: DynamoDB insertion failed'
            );
        });
    });
});
