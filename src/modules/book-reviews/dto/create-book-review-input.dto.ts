import { InputType, Field, Int } from '@nestjs/graphql';
import {IsInt, IsOptional, Min, Max, IsNotEmpty, IS_STRING, IsString} from 'class-validator';

@InputType()
export class CreateBookReviewInput {
    @Field(() => String)
    @IsNotEmpty({ message: 'ID is required' })
    @IsString({ message: 'Book ID must be a valid string' })
    bookId: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @Field({ nullable: true })
    @IsOptional()
    reviewText?: string;
}
