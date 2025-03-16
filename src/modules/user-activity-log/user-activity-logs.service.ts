import { Injectable } from '@nestjs/common';
import { UserActivityLogsRepository } from '@user-activity-log/user-activity-logs.repository';
import { UserActivityLogDto } from './dto/user-activity-log.dto';
import { UserActivityLog } from './types/user-activity-log.type';

@Injectable()
export class UserActivityLogsService {
    constructor(
        private readonly userActivityLogsRepository: UserActivityLogsRepository
    ) {}

    async getUserActivityLogs(userId: string): Promise<UserActivityLogDto[]> {
        try {
            return await this.userActivityLogsRepository.getUserActivityLogs(
                userId
            );
        } catch (error) {
            throw new Error(
                `Failed to get user activity logs: ${error.message}`
            );
        }
    }

    async createUserActivityLog(input: UserActivityLog): Promise<void> {
        try {
            await this.userActivityLogsRepository.createUserActivityLog(input);
        } catch (error) {
            throw new Error(
                `Failed to create new user activity log: ${error.message}`
            );
        }
    }
}
