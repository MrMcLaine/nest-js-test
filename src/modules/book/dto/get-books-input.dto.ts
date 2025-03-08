import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { SortOrder } from '@common/enums';
import { SortField } from '@book/constants';

@InputType()
export class GetBooksInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    title?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    author?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    publicationYear?: number;

    @Field(() => SortField, { nullable: true })
    @IsOptional()
    @IsEnum(SortField)
    sortField?: SortField;

    @Field(() => SortOrder, { nullable: true })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;
}
