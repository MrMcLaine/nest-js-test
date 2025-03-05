import { JwtPayload } from '@auth/types/jwt-payload';

export interface ContextNest {
    token: string;
    user: JwtPayload;
}
