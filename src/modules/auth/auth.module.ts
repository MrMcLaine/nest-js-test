import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvName } from '@common/enums/env-name.enum';
import { UserModule } from '@user/user.module';
import { AuthService } from '@auth/auth.service';
import { AuthResolver } from '@auth/auth.resolver';
import { AclGuard } from '@auth/acl.guard';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>(EnvName.JWT_SECRET),
                signOptions: {
                    expiresIn: configService.get<string>(
                        EnvName.JWT_EXPIRES_IN,
                        '1h'
                    ),
                },
            }),
        }),
        forwardRef(() => UserModule),
    ],
    providers: [AuthResolver, AuthService, AclGuard, JwtAuthGuard],
    exports: [AuthService, AclGuard, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
