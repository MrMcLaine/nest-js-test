import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                'trusted-cdn.com',
            ],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: [
                "'self'",
                'http://localhost:5000',
            ],
        },
    },
};
