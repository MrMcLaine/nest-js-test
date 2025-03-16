import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { UserActivityLogDto } from './dto/user-activity-log.dto';
import { UserActivityLog } from './types/user-activity-log.type';

@Injectable()
export class UserActivityLogsService {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async getUserActivityLogs(userId: string): Promise<UserActivityLogDto[]> {
        try {
            return await this.dynamoDBService.queryByPK<UserActivityLog>(
                `USER#${userId}`,
                'ACTIVITY#'
            );
        } catch (error) {
            throw new Error(
                `Failed to get user activity logs: ${error.message}`
            );
        }
    }

    async createUserActivityLog(input: UserActivityLog): Promise<void> {
        try {
            const logData = {
                PK: `USER#${input.userId}`,
                SK: `ACTIVITY#${Date.now()}`,
                EntityType: 'USER_ACTIVITY',
                ...input,
            };

            await this.dynamoDBService.putItem(logData);
        } catch (error) {
            throw new Error(
                `Failed to create new user activity log: ${error.message}`
            );
        }
    }
}
