import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseDtoEntity } from './base.dto.entity';
import { determineDatabaseDateType } from '@common/utils/determineDatabaseDateType';

export abstract class BaseEntity extends BaseDtoEntity {
    @CreateDateColumn({ type: determineDatabaseDateType() })
    createdAt: Date;

    @UpdateDateColumn({ type: determineDatabaseDateType() })
    updatedAt: Date;
}
