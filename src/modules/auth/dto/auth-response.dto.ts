import { ObjectType, Field } from '@nestjs/graphql';
import { UserDto } from '@user/dto/user-dto';

@ObjectType()
export class AuthResponse {
    @Field(() => UserDto)
    user: UserDto;

    @Field()
    token: string;
}
