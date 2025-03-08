import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseDtoEntity } from '@common/entities/base.dto.entity';
import { determineDatabaseDateType } from '@common/utils';

export abstract class BaseEntity extends BaseDtoEntity {
    @CreateDateColumn({ type: determineDatabaseDateType() })
    createdAt: Date;

    @UpdateDateColumn({ type: determineDatabaseDateType() })
    updatedAt: Date;
}
