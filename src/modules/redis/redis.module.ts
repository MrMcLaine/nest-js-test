import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from '@config/redis.config';
import { RedisDefaultService } from './redis-default.service';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [CacheModule.register(redisConfig)],
    exports: [CacheModule, RedisService],
    providers: [RedisDefaultService, RedisService],
})
export class RedisModule {}
