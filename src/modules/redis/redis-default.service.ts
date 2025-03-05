import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_DEFAULT_TTL } from '@redis/redis-ttl.const';

@Injectable()
export class RedisDefaultService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get<T>(key: string): Promise<T | null> {
        return await this.cacheManager.get<T>(key);
    }

    async set<T>(
        key: string,
        value: T,
        ttl: number = REDIS_DEFAULT_TTL
    ): Promise<void> {
        await this.cacheManager.set(key, value, ttl * 1000);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}
