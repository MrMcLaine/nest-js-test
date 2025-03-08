import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import {
    graphqlConfig,
    configModuleOptions,
    gqlThrottlerOptions,
    gqlThrottlerProviders,
    typeOrmConfig,
} from '@config';
import { DynamodbModule } from '@providers/dynamodb/dynamodb.module';
import { RedisModule } from '@providers/redis/redis.module';
import { AuthModule } from '@auth/auth.module';
import { BookModule } from '@book/book.module';
import { BookReviewsModule } from '@book-reviews/book-reviews.module';
import { UserModule } from '@user/user.module';
import { UserActivityLogsModule } from '@/user-activity-log/user-activity-logs.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        GraphQLModule.forRoot(graphqlConfig),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        ThrottlerModule.forRoot(gqlThrottlerOptions),
        AuthModule,
        UserModule,
        BookModule,
        BookReviewsModule,
        UserActivityLogsModule,
        DynamodbModule,
        RedisModule,
    ],
    providers: [gqlThrottlerProviders],
})
export class AppModule {}
