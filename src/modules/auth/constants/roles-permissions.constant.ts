import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';
import { UserRole } from '@user/constants/user-role.enum';

export const RolePermissions: Record<UserRole, UserActionPermissions[]> = {
    [UserRole.ADMIN]: [
        UserActionPermissions.CREATE_BOOK,
        UserActionPermissions.UPDATE_BOOK,
        UserActionPermissions.DELETE_BOOK,
        UserActionPermissions.CREATE_BOOK_REVIEW,
        UserActionPermissions.UPDATE_BOOK_REVIEW,
        UserActionPermissions.DELETE_BOOK_REVIEW,
    ],
    [UserRole.MODERATOR]: [
        UserActionPermissions.CREATE_BOOK,
        UserActionPermissions.UPDATE_BOOK,
        UserActionPermissions.CREATE_BOOK_REVIEW,
        UserActionPermissions.UPDATE_BOOK_REVIEW,
        UserActionPermissions.DELETE_BOOK_REVIEW,
    ],
    [UserRole.USER]: [
        UserActionPermissions.CREATE_BOOK_REVIEW,
        UserActionPermissions.UPDATE_BOOK_REVIEW,
        UserActionPermissions.DELETE_BOOK_REVIEW,
    ],
};
