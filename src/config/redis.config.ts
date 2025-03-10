import { redisStore } from 'cache-manager-redis-store';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvName } from '@common/enums';

const REDIS_DEFAULT_TTL = 300;
const REDIS_DEFAULT_LOCAL_PORT = 6379;
const REDIS_DEFAULT_LOCAL_HOST = 'redis';

export const redisConfig = (
    configService: ConfigService
): CacheModuleOptions => ({
    store: redisStore,
    host: configService.get<string>(
        EnvName.REDIS_HOST,
        REDIS_DEFAULT_LOCAL_HOST
    ),
    port: configService.get<number>(
        EnvName.REDIS_PORT,
        REDIS_DEFAULT_LOCAL_PORT
    ),
    ttl: REDIS_DEFAULT_TTL,
});
