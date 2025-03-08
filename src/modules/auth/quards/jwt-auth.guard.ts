import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context).getContext();
        const bearerToken = ctx.token;

        if (!bearerToken) {
            throw new UnauthorizedException('Token not found');
        }

        const token = bearerToken.replace('Bearer ', '');
        try {
            ctx.user = this.jwtService.verify(token);

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
