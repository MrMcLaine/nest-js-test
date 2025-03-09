import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBookInput } from '@book/dto';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
    @Field(() => String)
    @IsNotEmpty({ message: 'ID is required' })
    @IsString({ message: 'ID must be a valid string' })
    id: string;
}
