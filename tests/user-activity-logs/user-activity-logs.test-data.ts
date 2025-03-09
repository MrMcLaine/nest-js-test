import { UserActivityLog } from '@user-activity-log/types/user-activity-log.type';
import { mockUserId } from '../book-reviews/book-reviews.test-data';

export const mockLogs: UserActivityLog[] = [
    {
        userId: mockUserId,
        operationName: 'Login',
        date: new Date().toISOString(),
    },
];

export const failedMockLog: UserActivityLog = {
    userId: '1',
    operationName: 'Failed Attempt',
    date: new Date().toISOString(),
};
