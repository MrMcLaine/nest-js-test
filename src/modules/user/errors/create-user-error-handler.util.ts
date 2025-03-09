import { ERROR_USER_ALREADY_EXISTS } from '@user/constants';

export const createUserErrorHandlerUtil = (error: any): void => {
    if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error(ERROR_USER_ALREADY_EXISTS);
    }
    throw new Error(`Failed to create user: ${error.message}`);
};
