import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from '@config';
import { RedisDefaultService } from './redis-default.service';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [
        ConfigModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: redisConfig,
        }),
    ],
    exports: [CacheModule, RedisService],
    providers: [RedisDefaultService, RedisService],
})
export class RedisModule {}
