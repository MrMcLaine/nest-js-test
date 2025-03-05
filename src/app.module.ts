import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { graphqlConfig } from '@config/graphql.config';
import { postgresSqlConfig } from '@config/postgresSqlConfig';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { BookModule } from '@book/book.module';
import { BookReviewsModule } from './modules/book-reviews/book-reviews.module';
import { UserActivityLogsModule } from './modules/user-activity-log/user-activity-logs.module';

@Module({
    imports: [
        GraphQLModule.forRoot(graphqlConfig),
        TypeOrmModule.forRoot(postgresSqlConfig),
        AuthModule,
        UserModule,
        BookModule,
        BookReviewsModule,
        UserActivityLogsModule,
    ],
    controllers: [AppController],
    providers: [AppService, DynamoDBService],
})
export class AppModule {}
