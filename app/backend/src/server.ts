import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Cookies from "cookies";
import dotenv from "dotenv";
import { GraphQLFormattedError } from "graphql";
import { buildSchema, ArgumentValidationError } from "type-graphql";
import { dataSource } from "./database/config/datasource";
import { AuthResolver } from "./graphql/resolvers/user/auth-resolver";
import { customAuthChecker } from "./middlewares/auth-checker";
import { AppError } from "./middlewares/error-handler";
import { createAdmin } from "./scripts/create-admin";
import { seedTitles } from "./scripts/seed-titles";
import { CategoryResolver } from "./graphql/resolvers/category/category-resolver";
import { BooksResolver } from "./graphql/resolvers/book/book-resolver";
import { AuthorsResolver } from "./graphql/resolvers/author/author-resolver";
import { UserActionsResolver } from "./graphql/resolvers/user/user-actions-resolver";
import { UserBooksResolver } from "./graphql/resolvers/user/user-books-resolver";
import { BookReviewsResolver } from "./graphql/resolvers/book/book-review-resolver";
import { BookReviewVotesResolver } from "./graphql/resolvers/book/book-review-vote-resolver";
import { BookRecommendationsResolver } from "./graphql/resolvers/book/book-recommendation-resolver";
import { ProfileResolver } from "./graphql/resolvers/user/profile-resolver";
import { FollowResolver } from "./graphql/resolvers/user/follow-resolver";
import { FeedResolver } from "./graphql/resolvers/user/feed-resolver";
import { TitleResolver } from "./graphql/resolvers/gamification/title-resolver";
import { BookSearchResolver } from "./graphql/resolvers/book/book-search-resolver";
import { AdminResolver } from "./graphql/resolvers/admin/admin-resolver";
import { SiteBannersResolver } from "./graphql/resolvers/banner/site-banner-resolver";
import { StatsResolver } from "./graphql/resolvers/stats/stats-resolver";
import { createLoaders } from "./graphql/dataloaders";
import { whoami } from "./services/auth-service";
import { User } from "./database/entities/user/user";

dotenv.config(); // Load environment variables from .env file

// Check that COOKIE_SECRET is defined
if (!process.env.COOKIE_SECRET) {
    throw new Error("COOKIE_SECRET is not defined in environment variables.");
}

// Check that APP_PORT is defined
if (!process.env.APP_PORT) {
    throw new Error("APP_PORT is not defined in environment variables.");
}

(async () => {
    try {
        // Initialize the data source (e.g., connect to a database)
        await dataSource.initialize();

        // Safety net: the unaccent extension is created by the initial
        // migration, but keep this in case the database predates migrations.
        // Required by all search queries (book, author, user library).
        await dataSource.query("CREATE EXTENSION IF NOT EXISTS unaccent");

        // Create Admin user if doesn't exist
        await createAdmin();

        // Seed titles
        await seedTitles();

        // Constructing the GraphQL schema with TypeGraphQL
        // Replace the resolvers array with your actual resolvers
        const schema = await buildSchema({
            resolvers: [
                AuthResolver,
                CategoryResolver,
                BooksResolver,
                AuthorsResolver,
                UserActionsResolver,
                UserBooksResolver,
                BookReviewsResolver,
                BookReviewVotesResolver,
                BookRecommendationsResolver,
                ProfileResolver,
                FollowResolver,
                FeedResolver,
                TitleResolver,
                BookSearchResolver,
                AdminResolver,
                SiteBannersResolver,
                StatsResolver,
            ],
            validate: true, // Activate validation for input fields
            authChecker: customAuthChecker,
            emitSchemaFile: true, // Optional , for debugging
        });

        //Create instance of ApolloServer with the schema
        const server = new ApolloServer({
            schema,
            formatError: (
                formattedError: GraphQLFormattedError,
                error: unknown,
            ): GraphQLFormattedError => {
                // Check if the error is an instance of AppError
                if (error instanceof AppError) {
                    // Customize the format
                    return {
                        message: error.message,
                        extensions: {
                            code: error.errorType || "INTERNAL_SERVER_ERROR",
                            statusCode: error.statusCode,
                            additionalInfo: error.additionalInfo,
                        },
                    };
                }

                // Manage validation errors (class-validator)
                if (Array.isArray((error as any).validationErrors)) {
                    return {
                        message: "Erreur de validation",
                        extensions: {
                            code: "BAD_USER_INPUT",
                            validationErrors: (error as any).validationErrors,
                        },
                    };
                }

                // Manage validation errors (type-graphql)
                if (error instanceof ArgumentValidationError) {
                    return {
                        message: "Données invalides",
                        extensions: {
                            code: "BAD_USER_INPUT",
                            originalError: error.message,
                        },
                    };
                }

                // For other errors, you can handle them differently
                return formattedError;
            },
        });

        // Start the server
        const { url } = await startStandaloneServer(server, {
            listen: { port: Number(process.env.APP_PORT) || 4000 },
            context: async ({ req, res }) => {
                const cookies = new Cookies(req, res, {
                    keys: [process.env.COOKIE_SECRET || "default-secret"],
                });

                // Client IP for rate limiting. Behind the Vite proxy / a
                // reverse proxy the real client is in x-forwarded-for.
                const forwarded = req.headers["x-forwarded-for"];
                const ip =
                    (typeof forwarded === "string" && forwarded.length > 0
                        ? forwarded.split(",")[0]?.trim()
                        : undefined) ??
                    req.socket?.remoteAddress ??
                    "unknown";

                // Résolution paresseuse + mémoïsée de l'utilisateur :
                // partagée par tous les loaders dépendant de l'utilisateur,
                // évite N appels whoami() sur le catalogue public.
                let userPromise: Promise<User | null | undefined> | undefined;
                const getUser = () => {
                    if (!userPromise) {
                        userPromise = whoami(cookies).catch(() => null);
                    }
                    return userPromise;
                };

                return { cookies, ip, loaders: createLoaders(getUser) };
            },
        });

        console.log(
            `🚀  Server ready at: ${url} \n 🚀 Backend : http://localhost:5173/api \n 🚀 Frontend : http://localhost:5173`,
        );
    } catch (error) {
        console.error("🚨 Error during initialization:", error);
    }
})();
