import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DynamodbModule } from '../../providers/dynamodb/dynamodb.module';
import { UserActivityLogsMiddleware } from './user-activity-logs.middleware';
import { UserActivityLogsResolver } from './user-activity-logs.resolver';
import { UserActivityLogsService } from './user-activity-logs.service';

@Module({
    imports: [AuthModule, DynamodbModule],
    providers: [UserActivityLogsService, UserActivityLogsResolver],
})
export class UserActivityLogsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserActivityLogsMiddleware).forRoutes('*');
    }
}
