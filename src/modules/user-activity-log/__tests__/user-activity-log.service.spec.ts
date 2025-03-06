import { Test, TestingModule } from '@nestjs/testing';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { DynamoDBService } from '@dynamodb/dynamodb.service';
import { mockUser } from '@user/__tests__/user.test-data';
import { UserActivityLogsService } from '@/user-activity-log/user-activity-logs.service';
import { mockLogs } from '@/user-activity-log/__tests__/user-activity-logs.test-data';
import { dynamodbMock } from '../../../test-utils/mocks/dynamodb.mock';

describe('UserActivityLogsService', () => {
    let userActivityLogsService: UserActivityLogsService;
    let dynamoDBService: DynamoDBService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserActivityLogsService, dynamodbMock],
        }).compile();

        userActivityLogsService = module.get<UserActivityLogsService>(
            UserActivityLogsService
        );
        dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserActivityLogs', () => {
        it('should return user activity logs successfully', async () => {
            jest.spyOn(dynamoDBService, 'queryTable').mockResolvedValue(
                mockLogs
            );

            const result = await userActivityLogsService.getUserActivityLogs(
                mockUser.id
            );

            expect(result).toEqual(mockLogs);
            expect(dynamoDBService.queryTable).toHaveBeenCalledWith(
                DynamoTables.USER_ACTIVITY_LOGS,
                { userId: mockUser.id }
            );
        });

        it('should throw an error if querying logs fails', async () => {
            jest.spyOn(dynamoDBService, 'queryTable').mockRejectedValue(
                new Error('DynamoDB query failed')
            );

            await expect(
                userActivityLogsService.getUserActivityLogs(1)
            ).rejects.toThrow(
                'Failed to get user activity logs: DynamoDB query failed'
            );
        });
    });

    describe('createUserActivityLog', () => {
        it('should create a user activity log successfully', async () => {
            const expectedLog = { id: expect.any(String), ...mockLogs };

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

        it('should throw an error if inserting log fails', async () => {
            jest.spyOn(dynamoDBService, 'putItem').mockRejectedValue(
                new Error('DynamoDB insertion failed')
            );

            await expect(
                userActivityLogsService.createUserActivityLog(mockLogs[0])
            ).rejects.toThrow(
                'Failed to create new user activity log: DynamoDB insertion failed'
            );
        });
    });
});
