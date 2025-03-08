import { ObjectType, Field } from '@nestjs/graphql';
import { BaseDtoEntity } from '@common/entities';

@ObjectType()
export class BookDto extends BaseDtoEntity {
    @Field()
    title: string;

    @Field()
    author: string;

    @Field()
    publicationYear: number;

    @Field({ nullable: true })
    description: string;
}
