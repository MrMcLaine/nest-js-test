import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { DynamoTables } from '@common/enums/dynamo-tables.enum';
import { UserActivityLogDto } from './dto/user-activity-log.dto';

@Injectable()
export class UserActivityLogsService {
    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async getUserActivityLogs(userId: number): Promise<UserActivityLogDto[]> {
        try {
            console.log('Querying with userId:', userId);

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
}
