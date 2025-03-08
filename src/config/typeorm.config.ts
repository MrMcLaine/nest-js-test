import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvName } from '@common/enums';
import { User } from '@user/user.entity';
import { Book } from '@book/book.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(EnvName.DB_HOST, defaultConfig.host),
        port: configService.get<number>(EnvName.DB_PORT, defaultConfig.port),
        username: configService.get<string>(
            EnvName.DB_USERNAME,
            defaultConfig.username
        ),
        password:
            configService.get<string | undefined>(EnvName.DB_PASSWORD) ||
            defaultConfig.password,
        database: configService.get<string>(
            EnvName.DB_NAME,
            defaultConfig.database
        ),
        entities: [User, Book],
        synchronize: true,
        logging: true,
    }),
};

const defaultConfig = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'nestjs_db',
};
