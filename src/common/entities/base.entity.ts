import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseDtoEntity } from './base.dto.entity';

export abstract class BaseEntity extends BaseDtoEntity {
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
