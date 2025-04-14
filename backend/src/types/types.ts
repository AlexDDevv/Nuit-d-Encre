import { User } from "../database/entities/user";

/**
 * Type definition for the context used in GraphQL resolvers.
 * It contains the HTTP request and response objects (`req`, `res`),
 * and the current authenticated user (`user`).
 * `user` can be `null` if the user is not authenticated.
 */

export type ContextType = {
    req: any;
    res: any;
    user: User | null | undefined;
};
