import { UserActivityLogDto } from '@/user-activity-log/dto/user-activity-log.dto';
import { mockUser } from '@user/__tests__/user.test-data';

export const mockLogs: UserActivityLogDto[] = [
    {
        userId: mockUser.id,
        operationName: 'Login',
        date: new Date().toISOString(),
    },
];
