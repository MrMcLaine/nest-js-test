import { ObjectType, Field } from '@nestjs/graphql';
import { BookDto } from '@book/dto';

@ObjectType()
export class GetBooksResponseDto {
    @Field(() => [BookDto])
    books: BookDto[];

    @Field()
    hasMore: boolean;
}
