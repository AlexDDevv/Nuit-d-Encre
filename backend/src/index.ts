import "reflect-metadata";
import { dataSource } from "./db";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { UserResolver } from "./resolvers/User";
import { authChecker, ContextType, getUserFromContext } from "./auth";

const initialize = async () => {
    await dataSource.initialize();
    console.log("DataSource is connected");

    const schema = await buildSchema({
        resolvers: [UserResolver],
        authChecker,
    });

    const server = new ApolloServer({ schema });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 5000 },

        context: async ({ req, res }) => {
            const context: ContextType = {
                req,
                res,
                user: undefined,
            };
            const user = await getUserFromContext(context);
            context.user = user;
            return context;
        },
    });

    console.log(`GraphQL server ready at ${url}`);
};

initialize();
