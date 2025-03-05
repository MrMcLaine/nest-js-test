import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { graphqlConfig } from '@config/graphql.config';
import { postgresSqlConfig } from '@config/postgresSqlConfig';
import { redisConfig } from '@config/redis.config';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { BookModule } from '@book/book.module';
import { BookReviewsModule } from './modules/book-reviews/book-reviews.module';
import { UserActivityLogsModule } from './modules/user-activity-log/user-activity-logs.module';
import { DynamodbModule } from './modules/dynamodb/dynamodb.module';

@Module({
    imports: [
        GraphQLModule.forRoot(graphqlConfig),
        TypeOrmModule.forRoot(postgresSqlConfig),
        CacheModule.register(redisConfig),
        AuthModule,
        UserModule,
        BookModule,
        BookReviewsModule,
        UserActivityLogsModule,
        DynamodbModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
