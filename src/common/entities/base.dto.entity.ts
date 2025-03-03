import {
    PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseDtoEntity {
    @PrimaryGeneratedColumn()
    id: number;
}
