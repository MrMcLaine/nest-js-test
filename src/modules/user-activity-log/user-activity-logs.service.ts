import { Injectable } from '@nestjs/common';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { UserActivityLogDto } from './dto/user-activity-log.dto';
import { UserActivityLog } from './types/user-activity-log.type';

@Injectable()
export class UserActivityLogsService {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async getUserActivityLogs(userId: number): Promise<UserActivityLogDto[]> {
        try {
            const t = await this.dynamoDBService.queryTable<UserActivityLogDto>(
                DynamoTables.USER_ACTIVITY_LOGS,
                { userId }
            );

            console.log('t', t);

            return t;
        } catch (error) {
            throw new Error(
                `Failed to get user activity logs: ${error.message}`
            );
        }
    }

    async createUserActivityLog(input: UserActivityLog): Promise<void> {
        try {
            const logData = {
                id: `${input.userId}_${Date.now()}`,
                ...input,
            };

            await this.dynamoDBService.putItem(
                DynamoTables.USER_ACTIVITY_LOGS,
                logData
            );
        } catch (error) {
            throw new Error(
                `Failed to create new user activity log: ${error.message}`
            );
        }
    }
}
