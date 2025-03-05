import { ObjectType, Field } from '@nestjs/graphql';
import { UserActivityLog } from '../types/user-activity-log.type';

@ObjectType()
export class UserActivityLogDto implements UserActivityLog {
    @Field()
    userId: number;

    @Field()
    timestamp: string;

    @Field()
    requestMethod: string;

    @Field()
    requestUrl: string;

    @Field({ nullable: true })
    requestBody?: string;

    @Field({ nullable: true })
    requestParams?: string;

    @Field({ nullable: true })
    requestQuery?: string;
}
