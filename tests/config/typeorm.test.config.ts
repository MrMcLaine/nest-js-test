import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Book } from '../../src/modules/book/book.entity';
import { User } from '../../src/modules/user/user.entity';

export const typeormTestConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'test_db',
    entities: [Book, User],
    synchronize: true,
};
