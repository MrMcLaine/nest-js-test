import { EnvName } from '@common/enums/env-name.enum';
import Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';

export const configModuleOptions: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: Joi.object({
        [EnvName.PORT]: Joi.number().default(5000),

        [EnvName.DB_HOST]: Joi.string().required(),
        [EnvName.DB_PORT]: Joi.number().required(),
        [EnvName.DB_USERNAME]: Joi.string().required(),
        [EnvName.DB_PASSWORD]: Joi.string().allow(''),
        [EnvName.DB_NAME]: Joi.string().required(),

        [EnvName.JWT_SECRET]: Joi.string().required(),
        [EnvName.JWT_EXPIRES_IN]: Joi.string(),

        [EnvName.AWS_ACCESS_KEY_ID]: Joi.string().required(),
        [EnvName.AWS_SECRET_ACCESS_KEY]: Joi.string().required(),
        [EnvName.AWS_REGION]: Joi.string().allow(''),

        [EnvName.REDIS_HOST]: Joi.string().required(),
        [EnvName.REDIS_PORT]: Joi.number().required(),
        [EnvName.REDIS_PASSWORD]: Joi.string().allow(''),
    }),
};
