import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../constants/user-role.enum';
import { BaseDtoEntity } from '@common/entities/base.dto.entity';

@ObjectType()
export class UserDto extends BaseDtoEntity {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field(() => UserRole)
    role: UserRole;
}
