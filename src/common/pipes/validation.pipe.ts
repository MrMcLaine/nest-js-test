import { ValidationPipe } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export const CustomValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,

    exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints).join(', '),
        }));

        return new GraphQLError('Validation Failed', {
            extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: formattedErrors,
            },
        });
    },
});
