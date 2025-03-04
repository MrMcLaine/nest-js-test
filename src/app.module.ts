import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { graphqlConfig } from '@config/graphql.config';
import { postgresSqlConfig } from '@config/postgresSqlConfig';
import { UserModule } from '@user/user.module';

@Module({
    imports: [
        GraphQLModule.forRoot(graphqlConfig),
        TypeOrmModule.forRoot(postgresSqlConfig),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
