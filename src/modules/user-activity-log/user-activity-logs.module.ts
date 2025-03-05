import { forwardRef, Module } from '@nestjs/common';
import { UserActivityLogsService } from './user-activity-logs.service';
import { UserActivityLogsResolver } from './user-activity-logs.resolver';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { AuthModule } from '@auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [
        UserActivityLogsService,
        UserActivityLogsResolver,
        DynamoDBService,
    ],
})
export class UserActivityLogsModule {}
