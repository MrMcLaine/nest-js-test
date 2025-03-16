import { DataSource } from 'typeorm';
import { typeOrmSettings } from './typeorm.settings';

export const AppDataSource = new DataSource(typeOrmSettings);
