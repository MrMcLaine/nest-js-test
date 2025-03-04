import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@config/jwt.config';
import { UserModule } from '@user/user.module';
import { AuthService } from '@auth/auth.service';
import { AuthResolver } from '@auth/auth.resolver';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConfig.secret,
            signOptions: { expiresIn: jwtConfig.expiresIn },
        }),
        forwardRef(() => UserModule),
    ],
    providers: [AuthResolver, AuthService],
    exports: [AuthService],
})
export class AuthModule {}
