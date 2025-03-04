import { registerEnumType } from '@nestjs/graphql';

export enum SortField {
    TITLE = 'title',
    AUTHOR = 'author',
    PUBLICATION_YEAR = 'publicationYear',
}

registerEnumType(SortField, {
    name: 'SortField',
    description: 'Sorting field for queries',
});
