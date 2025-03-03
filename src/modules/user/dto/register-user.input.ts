import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;
}
