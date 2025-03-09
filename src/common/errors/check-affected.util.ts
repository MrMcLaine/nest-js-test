import { NotFoundException } from '@nestjs/common';

interface CheckAffected {
    affected: number;
    entityName: string;
    id: string;
}

export const checkAffectedRows = (input: CheckAffected) => {
    if (input.affected === 0) {
        throw new NotFoundException(
            `${input.entityName} with ID ${input.id} not found`
        );
    }
};
