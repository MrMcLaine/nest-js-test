import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Book } from './book.entity';
import { buildBookQuery } from '@book/utils';
import { GetBooksInput } from '@book/dto';
import { UpdatedBooksResponse } from '@book/types';

@Injectable()
export class BookRepository {
    constructor(private readonly dataSource: DataSource) {}

    private get repository() {
        return this.dataSource.getRepository(Book);
    }

    async findBooks(input?: GetBooksInput): Promise<Book[]> {
        let queryBuilder = this.repository.createQueryBuilder('book');
        queryBuilder = buildBookQuery(queryBuilder, input);

        return await queryBuilder.getMany();
    }

    async createBook(input: Partial<Book>): Promise<Book> {
        const newBook = this.repository.create(input);

        return await this.repository.save(newBook);
    }

    async updateBookData(
        id: string,
        updateData: Partial<Book>
    ): Promise<UpdatedBooksResponse> {
        const result = await this.repository
            .createQueryBuilder()
            .update(Book)
            .set(updateData)
            .where('id = :id', { id })
            .returning('*')
            .execute();

        return {
            affected: result.affected || 0,
            book: result.raw[0] || null,
        };
    }

    async deleteBookById(id: string): Promise<number> {
        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(Book)
            .where('id = :id', { id })
            .execute();

        return result.affected || 0;
    }
}
