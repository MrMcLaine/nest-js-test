import { Entity, Column } from 'typeorm';
import { BaseEntity, tableNames } from '@common/entities';
import { determineUserRoleColumnOptions } from '@common/utils';
import { UserRole } from '@user/constants';

@Entity({ name: tableNames.USERS })
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column(determineUserRoleColumnOptions())
    role: UserRole;
}
