import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Book } from '@book/book.entity';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { BookService } from '@book/book.service';
import { RedisService } from '@redis/redis.service';
import { AuthService } from '@auth/auth.service';

export const createTestModule = async (): Promise<TestingModule> => {
    return await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                entities: [Book, User],
                synchronize: true,
            }),
            TypeOrmModule.forFeature([Book, User]),
        ],
        providers: [
            BookService,
            AuthService,
            UserService,
            JwtService,
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
