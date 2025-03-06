import { ColumnType } from 'typeorm/driver/types/ColumnTypes';

export const getDateType = (): ColumnType => {
    return process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp';
};
