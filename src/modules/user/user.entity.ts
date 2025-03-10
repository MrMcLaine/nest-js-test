import { Entity, Column } from 'typeorm';
import { BaseEntity, tableNames } from '@common/entities';
import { UserRole } from '@user/constants';

@Entity({ name: tableNames.USERS })
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;
}
