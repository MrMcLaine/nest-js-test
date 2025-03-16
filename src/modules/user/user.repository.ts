import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly dataSource: DataSource) {}

    private get repository() {
        return this.dataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOneBy({ email });
    }

    async createUser(input: Partial<User>): Promise<User> {
        const user = this.repository.create(input);

        return await this.repository.save(user);
    }
}
