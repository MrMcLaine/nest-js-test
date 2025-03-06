import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { graphqlConfig } from '@config/graphql.config';
import { postgresSqlConfig } from '@config/postgresSqlConfig';
import { gqlThrottlerOptions } from '@config/gglThrottler/gql-throttler-options.config';
import { gqlThrottlerProviders } from '@config/gglThrottler/gql-throttler-providers.config';
import { DynamodbModule } from '@dynamodb/dynamodb.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { BookModule } from '@book/book.module';
import { RedisModule } from '@redis/redis.module';
import { BookReviewsModule } from '@book-reviews/book-reviews.module';
import { UserActivityLogsModule } from '@/user-activity-log/user-activity-logs.module';

@Module({
    imports: [
        GraphQLModule.forRoot(graphqlConfig),
        TypeOrmModule.forRoot(postgresSqlConfig),
        ThrottlerModule.forRoot(gqlThrottlerOptions),
        AuthModule,
        UserModule,
        BookModule,
        BookReviewsModule,
        UserActivityLogsModule,
        DynamodbModule,
        RedisModule,
    ],
    controllers: [AppController],
    providers: [AppService, gqlThrottlerProviders],
})
export class AppModule {}
