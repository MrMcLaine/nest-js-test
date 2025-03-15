import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_DEFAULT_TTL } from './redis-ttl.const';

@Injectable()
export class RedisDefaultService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get<T>(key: string): Promise<T | null> {
        const value = await this.cacheManager.get<T>(key);
        return value ? value : null;
    }

    async getSet<T>(key: string): Promise<T[]> {
        return (await this.cacheManager.get<T[]>(key)) || [];
    }

    async set<T>(
        key: string,
        value: T,
        ttl: number = REDIS_DEFAULT_TTL
    ): Promise<void> {
        await this.cacheManager.set(key, value, ttl * 1000);
    }

    async setAdd<T>(key: string, value: T): Promise<void> {
        const existingValues: T[] =
            (await this.cacheManager.get<T[]>(key)) || [];
        if (!existingValues.includes(value)) {
            existingValues.push(value);
            await this.cacheManager.set(key, existingValues);
        }
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async delMultiple(keys: string[]): Promise<void> {
        if (keys.length > 0) {
            await Promise.all(keys.map((key) => this.cacheManager.del(key)));
        }
    }
}
