import { PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseDtoEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;
}
