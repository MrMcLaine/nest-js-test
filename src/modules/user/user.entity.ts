import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { tableNames } from '@common/entities/tableNames';
import { getUserRoleColOptions } from '@common/utils/getUserRoleColOptions';
import { UserRole } from './constants/user-role.enum';

@Entity({ name: tableNames.USERS })
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column(getUserRoleColOptions())
    role: UserRole;
}
