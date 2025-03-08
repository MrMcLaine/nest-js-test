import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BookReview } from '../types/book-review.type';

@ObjectType()
export class BookReviewDto implements BookReview {
    @Field()
    reviewId: string;

    @Field()
    bookId: string;

    @Field()
    userId: string;

    @Field(() => Int)
    rating: number;

    @Field({ nullable: true })
    reviewText?: string;

    @Field()
    createdAt: string;
}
