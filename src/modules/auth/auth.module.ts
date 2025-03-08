import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@config';
import { UserModule } from '@user/user.module';
import { AuthService } from '@auth/auth.service';
import { AuthResolver } from '@auth/auth.resolver';
import { AclGuard, JwtAuthGuard } from '@auth/quards';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                jwtConfig(configService),
        }),
    ],
    providers: [AuthResolver, AuthService, AclGuard, JwtAuthGuard],
    exports: [AuthService, AclGuard, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
