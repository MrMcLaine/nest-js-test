import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { BookService } from './book.service';
import { BookResolver } from '@book/book.resolver';
import { Book } from '@book/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book]), forwardRef(() => AuthModule)],
    providers: [BookService, BookResolver],
})
export class BookModule {}
