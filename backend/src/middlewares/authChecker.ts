import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import Cookies from "cookies";
import { AuthChecker } from "type-graphql";
import { User } from "../database/entities/user";
import { ContextType } from "../types/types";

/**
 * Extends `ContextType` by ensuring the `user` field is always present.
 * This type is used when the user is guaranteed to be authenticated.
 */
export type AuthContextType = ContextType & { user: User };

/**
 * Retrieves the authenticated user from the context based on the JWT token
 * stored in the cookies.
 *
 * It attempts to verify the JWT token, then fetches the user from the database.
 * If no token is found or the token is invalid, `null` is returned.
 *
 * @param context - The GraphQL context containing the request and response objects.
 * @returns The authenticated user or `null` if authentication fails.
 */

export const getUserFromContext = async (
    context: ContextType
): Promise<User | null> => {
    // Retrieve the token from the cookies
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get("token");

    // If token is missing, log and return null
    if (!token) {
        console.log("Missing token in cookies");
        return null;
    }

    try {
        // Verify the token using the secret key from environment variables
        const payload = verify(
            token,
            process.env.JWT_SECRET_KEY
        ) as unknown as { id: number };

        console.log("Access authorized");

        // Fetch the user from the database based on the decoded payload
        const user = await User.findOneBy({
            id: payload.id,
        });

        return user;
    } catch (err) {
        console.error(err);
        throw new Error("Invalid JWT");
    }
};

/**
 * Custom authentication checker for GraphQL.
 * It checks whether the authenticated user has one of the required roles.
 *
 * This function is used by the `type-graphql` library to protect access to resolvers.
 * It verifies the JWT token and checks the user's role against the required roles.
 *
 * @param param0 - The GraphQL resolver context containing the user and request info.
 * @param roles - A list of roles required to access the resolver.
 * @returns `true` if the user is authenticated and has the required role, `false` otherwise.
 */

export const authChecker: AuthChecker<ContextType> = async (
    { root, args, context, info },
    roles
) => {
    // Default to checking if the user is an admin if no roles are specified
    if (roles.length === 0) {
        roles = ["admin"];
    }

    // Get the user from the context (authenticated via JWT token)
    const user = await getUserFromContext(context);
    context.user = user;

    // Check if the user has the required role
    if (user && roles.includes(user.role)) {
        return true;
    } else {
        return false;
    }
};

/**
 * Middleware to control user data visibility based on the requester's identity.
 * Admins and the owner of the data can access full user details.
 * Otherwise, only an obfuscated email is returned.
 */

export const IsUser: MiddlewareFn<AuthContextType> = async (
    { context, root },
    next
) => {
    if (context.user.role === "admin" || context.user.id === root.id) {
        return await next();
    } else {
        return "●●●●●@●●●●●.com";
    }
};
