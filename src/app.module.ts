import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { graphqlConfig } from './config/graphql.config';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [GraphQLModule.forRoot(graphqlConfig), UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
