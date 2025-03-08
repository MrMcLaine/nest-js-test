import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import {
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
} from '@user/constants';

@InputType()
export class RegisterUserInput {
    @Field()
    @IsNotEmpty({ message: 'Username is required' })
    @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
        message: 'Username must be between 3 and 20 characters',
    })
    username: string;

    @Field()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @Field()
    @IsNotEmpty({ message: 'Password is required' })
    @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, {
        message: 'Password must be between 8 and 30 characters',
    })
    password: string;
}
