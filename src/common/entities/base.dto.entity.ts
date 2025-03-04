import { PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseDtoEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Number)
    id: number;
}
