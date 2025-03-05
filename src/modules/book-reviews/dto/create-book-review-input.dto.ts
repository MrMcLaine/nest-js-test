import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBookReviewInput {
    @Field(() => Int)
    @IsNotEmpty({ message: 'ID is required' })
    @IsInt({ message: 'ID must be a valid integer' })
    bookId: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @Field({ nullable: true })
    @IsOptional()
    reviewText?: string;
}
