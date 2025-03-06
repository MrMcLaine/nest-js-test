import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@book/book.entity';
import { BookService } from '@book/book.service';
import { RedisService } from '@redis/redis.service';

export const createTestModule = async (): Promise<TestingModule> => {
    return await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                entities: [Book],
                synchronize: true,
            }),
            TypeOrmModule.forFeature([Book]),
        ],
        providers: [
            BookService,
            {
                provide: RedisService,
                useValue: {
                    getBookPagesCache: jest.fn(),
                    setBookPagesCache: jest.fn(),
                    clearAllBookPagesCache: jest.fn(),
                },
            },
        ],
    }).compile();
};
