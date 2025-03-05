import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserActivityLogsService } from './user-activity-logs.service';

@Injectable()
export class UserActivityLogsMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userActivityLogsService: UserActivityLogsService
    ) {}

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next();
            }

            const token = authHeader.replace('Bearer ', '');
            const decodedToken = this.jwtService.verify(token);
            const userId = decodedToken.sub;

            if (!isNeedSkip(req.body?.operationName)) {
                await this.userActivityLogsService.createUserActivityLog({
                    userId,
                    date: new Date().toISOString(),
                    operationName: req.body?.operationName,
                });
            }
        } catch (error) {
            console.error('Failed to log user activity:', error.message);
        }

        next();
    }
}

const isNeedSkip = (operationName: string): boolean => {
    if (
        operationName === 'IntrospectionQuery' ||
        operationName === 'GetUserActivityLogs'
    )
        return true;
};
