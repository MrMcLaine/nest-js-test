import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { Book } from '@book/book.entity';
import { BookResolver } from '@book/book.resolver';
import { BookService } from './book.service';
import { BookRepository } from '@book/book.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Book]), AuthModule],
    providers: [BookRepository, BookService, BookResolver],
})
export class BookModule {}
