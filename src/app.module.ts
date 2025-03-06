import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { graphqlConfig } from '@config/graphql.config';
import { configModuleOptions } from '@config/config-module-options.config';
import { gqlThrottlerOptions } from '@config/gglThrottler/gql-throttler-options.config';
import { gqlThrottlerProviders } from '@config/gglThrottler/gql-throttler-providers.config';
import { typeOrmConfig } from '@config/typeorm.config';
import { DynamodbModule } from '@dynamodb/dynamodb.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { BookModule } from '@book/book.module';
import { RedisModule } from '@redis/redis.module';
import { BookReviewsModule } from '@book-reviews/book-reviews.module';
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
