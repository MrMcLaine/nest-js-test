import { APP_GUARD } from '@nestjs/core';
import { Provider } from '@nestjs/common';
import { GqlThrottlerGuard } from '@config/gglThrottler/gql-throttler-guard';

export const gqlThrottlerProviders: Provider = {
    provide: APP_GUARD,
    useClass: GqlThrottlerGuard,
};
