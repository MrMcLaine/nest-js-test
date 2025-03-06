import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';

const DEFAULT_THROTTLE_TTL = 60000;
const DEFAULT_REQUEST_LIMIT = 20;

export const gqlThrottlerOptions: ThrottlerModuleOptions = {
    throttlers: [{ limit: DEFAULT_REQUEST_LIMIT, ttl: DEFAULT_THROTTLE_TTL }],
};
