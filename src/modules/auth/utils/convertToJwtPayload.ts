import { JwtPayload } from '@auth/types/jwt-payload';
import { UserDto } from '@user/dto/user-dto';

export const convertToJwtPayload = (user: UserDto): JwtPayload => {
    return {
        username: user.username,
        sub: user.id,
        role: user.role,
    };
};
