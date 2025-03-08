import { ObjectType, Field } from '@nestjs/graphql';
import { BaseDtoEntity } from '@common/entities';
import { UserRole } from '@user/constants';

@ObjectType()
export class UserDto extends BaseDtoEntity {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field(() => UserRole)
    role: UserRole;
}
