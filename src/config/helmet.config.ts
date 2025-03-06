import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'trusted-cdn.com'],
        },
    },
};
