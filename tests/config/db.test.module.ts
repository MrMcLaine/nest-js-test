import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptUtil } from '@common/utils/bcrypt.util';
import { EnvName } from '@common/enums/env-name.enum';
import { Book } from '@book/book.entity';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { BookService } from '@book/book.service';
import { RedisService } from '@providers/redis/redis.service';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/jwt.strategy';
import { testToken } from '../auth/auth.test-data';
import { DynamoDBService } from '@providers/dynamodb/dynamodb.service';
import { BookReviewsService } from '@book-reviews/book-reviews.service';
import { UserActivityLogsService } from '@user-activity-log/user-activity-logs.service';

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
            ConfigModule.forRoot({ isGlobal: true }),
            JwtModule.register({
                secret: 'test-secret',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        providers: [
            BookService,
            AuthService,
            UserService,
            JwtStrategy,
            BookReviewsService,
            UserActivityLogsService,
            {
                provide: JwtService,
                useValue: {
                    sign: jest.fn(() => testToken),
                },
            },
            {
                provide: ConfigService,
                useValue: {
                    get: (key: string) => {
                        const mockConfig = {
                            [EnvName.JWT_SECRET]: 'test-secret',
                            [EnvName.JWT_EXPIRES_IN]: '1h',
                        };
                        return mockConfig[key];
                    },
                },
            },
            {
                provide: RedisService,
                useValue: {
                    getBookPagesCache: jest.fn(),
                    setBookPagesCache: jest.fn(),
                    clearAllBookPagesCache: jest.fn(),
                    getAllBookReviewsFromCache: jest.fn(),
                    setAllBookReviewsToCache: jest.fn(),
                    deleteAllBookReviewsCache: jest.fn(),
                },
            },
            {
                provide: BcryptUtil,
                useValue: {
                    hashPassword: jest
                        .fn()
                        .mockResolvedValue('hashed-password'),
                },
            },
            {
                provide: DynamoDBService,
                useValue: {
                    queryTable: jest.fn(),
                    scanTable: jest.fn(),
                    putItem: jest.fn(),
                    updateItem: jest.fn(),
                    deleteItem: jest.fn(),
                },
            },
        ],
    }).compile();
};
