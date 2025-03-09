import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserActivityLogsService } from './user-activity-logs.service';
import { UserActivityLogDto } from './dto/user-activity-log.dto';

@Resolver()
export class UserActivityLogsResolver {
    constructor(
        private readonly userActivityLogsService: UserActivityLogsService
    ) {}

    @Query(() => [UserActivityLogDto])
    async getUserActivityLogs(
        @Args('userId') userId: string
    ): Promise<UserActivityLogDto[]> {
        return this.userActivityLogsService.getUserActivityLogs(userId);
    }
}
