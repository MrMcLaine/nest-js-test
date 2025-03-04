import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

export const graphqlConfig: ApolloDriverConfig = {
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    introspection: true,
    csrfPrevention: false,
    persistedQueries: false,
    allowBatchedHttpRequests: true,

    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],

    context: ({ req }) => {
        const token = req.headers.authorization || '';

        return { token };
    },
};
