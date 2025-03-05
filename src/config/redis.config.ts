import { redisStore } from 'cache-manager-redis-store';
import { CacheModuleOptions } from '@nestjs/cache-manager/dist/interfaces/cache-module.interface';
import * as process from 'node:process';

const REDIS_DEFAULT_TTL = 300;

export const redisConfig: CacheModuleOptions = {
    store: redisStore,
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    ttl: REDIS_DEFAULT_TTL,
};
