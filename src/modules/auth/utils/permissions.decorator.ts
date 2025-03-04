import { SetMetadata } from '@nestjs/common';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';

export const Permissions = (...permissions: UserActionPermissions[]) =>
    SetMetadata('permissions', permissions);
