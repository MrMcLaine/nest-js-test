import { ObjectType, Field } from '@nestjs/graphql';
import { UserActivityLog } from '../types/user-activity-log.type';

@ObjectType()
export class UserActivityLogDto implements UserActivityLog {
    @Field()
    userId: number;

    @Field()
    date: string;

    @Field()
    operationName: string;
}
