import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { UserRole } from './constants/user-role.enum';

@Entity()
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hashedPassword: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;
}
