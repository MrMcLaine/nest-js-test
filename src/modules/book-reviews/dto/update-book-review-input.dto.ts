import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBookReviewInput } from '@book-reviews/dto';

@InputType()
export class UpdateBookReviewInput extends PartialType(CreateBookReviewInput) {
    @Field()
    @IsNotEmpty({ message: 'Review ID is required' })
    @IsString({ message: 'Review ID must be a valid string' })
    reviewId: string;
}
