import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RolePermissions } from '@auth/constants/roles-permissions.constant';
import { UserActionPermissions } from '@auth/constants/user-action-permissions.enum';

@Injectable()
export class AclGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<UserActionPermissions[]>(
            'permissions',
            context.getHandler()
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context).getContext();
        const user = ctx.user;

        if (!user || !user.role) {
            throw new ForbiddenException('Access denied: No role assigned');
        }

        const userPermissions = RolePermissions[user.role] || [];

        if (
            !requiredPermissions.some((perm) => userPermissions.includes(perm))
        ) {
            throw new ForbiddenException(
                `Access denied: Insufficient permissions for the role: ${user.role}`
            );
        }

        return true;
    }
}
