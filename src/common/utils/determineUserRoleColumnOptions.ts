import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';
import { UserRole } from '@user/constants/user-role.enum';

export const determineUserRoleColumnOptions = (): ColumnOptions => {
    return process.env.NODE_ENV === 'test'
        ? { type: 'text', default: UserRole.USER }
        : { type: 'enum', enum: UserRole, default: UserRole.USER };
};
