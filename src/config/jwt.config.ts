import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { EnvName } from '@common/enums';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>(EnvName.JWT_SECRET),
    signOptions: {
        expiresIn: configService.get<string>(EnvName.JWT_EXPIRES_IN, '1h'),
    },
});
