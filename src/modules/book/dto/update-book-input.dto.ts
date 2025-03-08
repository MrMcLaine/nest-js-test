import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt } from 'class-validator';
import { CreateBookInput } from '@book/dto';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
    @Field(() => Int)
    @IsNotEmpty({ message: 'ID is required' })
    @IsInt({ message: 'ID must be a valid integer' })
    id: number;
}
