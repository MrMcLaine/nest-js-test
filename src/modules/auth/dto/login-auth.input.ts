import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import {
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
} from '@user/constants/others';

@InputType()
export class LoginAuthInput {
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
