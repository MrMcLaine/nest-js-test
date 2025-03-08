import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { tableNames } from '@common/entities/tableNames';

@Entity({ name: tableNames.BOOKS })
export class Book extends BaseEntity {
    @Column()
    @Index()
    title: string;

    @Column()
    @Index()
    author: string;

    @Column({ type: 'int' })
    @Index()
    publicationYear: number;

    @Column({ type: 'text', nullable: true })
    description: string | null;
}
