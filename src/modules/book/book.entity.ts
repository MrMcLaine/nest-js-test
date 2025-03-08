import { Entity, Column, Index } from 'typeorm';
import { BaseEntity, tableNames } from '@common/entities';

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
