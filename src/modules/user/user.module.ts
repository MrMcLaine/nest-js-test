import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/user.model';
import { UserResolver } from '@user/user.resolver';
import { UserService } from '@user/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserResolver, UserService],
})
export class UserModule {}
