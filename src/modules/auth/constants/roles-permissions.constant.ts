import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';
import { UserRole } from '@user/constants/user-role.enum';

export const RolePermissions: Record<UserRole, UserActionPermissions[]> = {
    [UserRole.ADMIN]: [
        UserActionPermissions.CREATE_BOOK,
        UserActionPermissions.UPDATE_BOOK,
        UserActionPermissions.DELETE_BOOK,
    ],
    [UserRole.MODERATOR]: [
        UserActionPermissions.CREATE_BOOK,
        UserActionPermissions.UPDATE_BOOK,
    ],
    [UserRole.USER]: [],
};
