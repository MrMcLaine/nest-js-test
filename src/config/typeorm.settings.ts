import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/user.entity';
import { Book } from '@book/book.entity';

const configService = new ConfigService();

const defaultConfig = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'nestjs_db',
};

export const typeOrmSettings: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', defaultConfig.host),
    port: configService.get<number>('DB_PORT', defaultConfig.port),
    username: configService.get<string>('DB_USERNAME', defaultConfig.username),
    password: configService.get<string>('DB_PASSWORD', defaultConfig.password),
    database: configService.get<string>('DB_NAME', defaultConfig.database),
    entities: [User, Book],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    logging: true,
};
