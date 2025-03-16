import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { UserActivityLogDto } from '@user-activity-log/dto/user-activity-log.dto';
import { UserActivityLog } from '@user-activity-log/types/user-activity-log.type';

@Injectable()
export class UserActivityLogsRepository {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async getUserActivityLogs(userId: string): Promise<UserActivityLogDto[]> {
        return await this.dynamoDBService.queryByPK<UserActivityLog>(
            `USER#${userId}`,
            'ACTIVITY#'
        );
    }

    async createUserActivityLog(input: UserActivityLog): Promise<void> {
        const logData = {
            PK: `USER#${input.userId}`,
            SK: `ACTIVITY#${Date.now()}`,
            EntityType: 'USER_ACTIVITY',
            ...input,
        };

        await this.dynamoDBService.putItem(logData);
    }
}
