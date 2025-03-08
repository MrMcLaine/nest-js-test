import { InputType, Field, Int } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    Length,
    IsInt,
    Min,
    IsOptional,
} from 'class-validator';
import {
    BOOK_AUTHOR_MAX_LENGTH,
    BOOK_AUTHOR_MIN_LENGTH,
    BOOK_DESCRIPTION_MAX_LENGTH,
    BOOK_DESCRIPTION_MIN_LENGTH,
    BOOK_TITLE_MAX_LENGTH,
    BOOK_TITLE_MIN_LENGTH,
} from '@book/constants';

@InputType()
export class CreateBookInput {
    @Field()
    @IsNotEmpty({ message: 'Title is required' })
    @Length(BOOK_TITLE_MIN_LENGTH, BOOK_TITLE_MAX_LENGTH, {
        message: 'Title must be between 3 and 100 characters',
    })
    title: string;

    @Field()
    @IsNotEmpty({ message: 'Author is required' })
    @Length(BOOK_AUTHOR_MIN_LENGTH, BOOK_AUTHOR_MAX_LENGTH, {
        message: 'Author name must be between 3 and 50 characters',
    })
    author: string;

    @Field(() => Int)
    @IsInt({ message: 'Publication year must be a valid integer' })
    @Min(0, { message: 'Publication year must be a positive number' })
    publicationYear: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @Length(BOOK_DESCRIPTION_MIN_LENGTH, BOOK_DESCRIPTION_MAX_LENGTH, {
        message: 'Description must be between 10 and 500 characters',
    })
    description?: string;
}
