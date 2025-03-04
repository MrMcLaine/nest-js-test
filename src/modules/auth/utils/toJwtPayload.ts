import { UserDto } from '@user/dto/user-dto';
import { JwtPayload } from '@auth/types/jwt-payload';

export const toJwtPayload = (user: UserDto): JwtPayload => {
    return {
        username: user.username,
        sub: user.id,
        role: user.role,
    };
};
