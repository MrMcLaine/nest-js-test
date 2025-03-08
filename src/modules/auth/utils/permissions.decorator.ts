import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY, UserActionPermissions } from '@auth/constants';

export const Permissions = (...permissions: UserActionPermissions[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);
