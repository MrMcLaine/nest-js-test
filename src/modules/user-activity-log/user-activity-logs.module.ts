import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { UserActivityLogsService } from './user-activity-logs.service';
import { UserActivityLogsResolver } from './user-activity-logs.resolver';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { AuthModule } from '@auth/auth.module';
import { UserActivityLogsMiddleware } from './user-activity-logs.middleware';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [
        UserActivityLogsService,
        UserActivityLogsResolver,
        DynamoDBService,
    ],
})
export class UserActivityLogsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserActivityLogsMiddleware).forRoutes('*');
    }
}
