import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@config/jwt.config';
import { UserModule } from '@user/user.module';
import { AuthService } from '@auth/auth.service';
import { AuthResolver } from '@auth/auth.resolver';
import { AclGuard } from '@auth/acl.guard';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: jwtConfig.secret,
                signOptions: { expiresIn: jwtConfig.expiresIn },
            }),
        }),
        forwardRef(() => UserModule),
    ],
    providers: [AuthResolver, AuthService, AclGuard, JwtAuthGuard],
    exports: [AuthService, AclGuard, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
