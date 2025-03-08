import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '@auth/constants/other.constants';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';

export const Permissions = (...permissions: UserActionPermissions[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);
