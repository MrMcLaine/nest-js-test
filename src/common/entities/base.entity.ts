import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseDtoEntity } from './base.dto.entity';
import { getDateType } from '@common/utils/getDateType';

export abstract class BaseEntity extends BaseDtoEntity {
    @CreateDateColumn({ type: getDateType() })
    createdAt: Date;

    @UpdateDateColumn({ type: getDateType() })
    updatedAt: Date;
}
