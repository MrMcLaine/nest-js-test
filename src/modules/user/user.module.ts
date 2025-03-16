import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { UserRepository } from '@user/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserRepository, UserService],
    exports: [UserService],
})
export class UserModule {}
