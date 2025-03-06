import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from 'joi';

export const configModuleOptions: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: Joi.object({
        PORT: Joi.number().default(5000),

        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().allow(''),
        DB_NAME: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string(),

        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().allow(''),
        AWS_DYNAMODB_TABLE: Joi.string().allow(''),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().allow(''),
    }),
};
