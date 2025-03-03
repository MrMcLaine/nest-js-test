import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MODERATOR = 'MODERATOR',
}

registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'Defines the role of a user in the system',
});
