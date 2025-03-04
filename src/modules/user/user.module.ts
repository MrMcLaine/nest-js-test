import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { UserResolver } from '@user/user.resolver';
import { UserService } from '@user/user.service';
import { AuthModule } from '@auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
