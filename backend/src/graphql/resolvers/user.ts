import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { validate } from "class-validator";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType } from "../../types/types";
import { User } from "../../database/entities/user";
import { createUserInput } from "../inputs/create/createUserInput";

/**
 * Resolver for user-related operations. This includes querying users, creating new users,
 * signing in and signing out, and fetching the currently authenticated user.
 * The resolver works with the `User` entity and provides functionality like:
 * - `user`: Fetch a user by their unique ID.
 * - `users`: Fetch all users.
 * - `createUser`: Create a new user and hash their password.
 * - `signIn`: Authenticate a user with their email and password, issue a JWT token, and set it in cookies.
 * - `signOut`: Remove the JWT token from cookies to sign the user out.
 * - `whoami`: Retrieve the currently authenticated user based on the request context.
 */

@Resolver()
export class UserResolver {
    /**
     * Retrieves a user by their unique ID.
     *
     * @param id - The unique identifier of the user to retrieve.
     * @returns The user with the provided ID or `null` if no user is found.
     */

    @Query(() => User, { nullable: true })
    async user(@Arg("id", () => ID) id: number): Promise<User | null> {
        const user = await User.findOne({
            where: { id },
        });

        if (user) {
            return user;
        } else {
            return null;
        }
    }

    /**
     * Retrieves all users from the database.
     *
     * @returns A list of all users in the system.
     */

    @Query(() => [User])
    async users(): Promise<User[]> {
        const users = await User.find();

        if (users) {
            return users;
        } else {
            return [];
        }
    }

    /**
     * Creates a new user and hashes their password.
     *
     * @param data - The input data for creating the user (email and password).
     * @returns The newly created user.
     * @throws An error if validation fails or user creation encounters an issue.
     */

    @Mutation(() => User)
    async createUser(
        @Arg("data", () => createUserInput) data: createUserInput
    ): Promise<User> {
        const errors = await validate(data);

        if (errors.length > 0) {
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }

        const newUser = new User();

        try {
            const hashedPassword = await hash(data.password);

            Object.assign(newUser, data, {
                hashedPassword,
                password: undefined,
            });

            await newUser.save();
            return newUser;
        } catch (err) {
            console.error(err);
            throw new Error("Unable to create user");
        }
    }

    /**
     * Signs in a user by verifying their email and password, and then issuing a JWT token.
     * The JWT token is then set in cookies to maintain the user's session.
     *
     * @param email - The email of the user attempting to sign in.
     * @param password - The password of the user attempting to sign in.
     * @param context - The context object containing request and response details.
     * @returns The signed-in user if authentication is successful, `null` otherwise.
     * @throws An error if there is an issue signing in the user.
     */

    @Mutation(() => User, { nullable: true })
    async signIn(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: ContextType
    ): Promise<User> {
        try {
            const user = await User.findOneBy({
                email,
            });
            if (user) {
                if (await verify(user.hashedPassword, password)) {
                    const token = sign(
                        {
                            id: user.id,
                        },
                        process.env.JWT_SECRET_KEY
                    );
                    console.log("🚀 ~ UserResolver ~ token:", token);

                    const cookies = new Cookies(context.req, context.res);

                    cookies.set("token", token, {
                        secure: false,
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 48, // 48 hours
                    });

                    return user;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
            throw new Error("Unable to sign in");
        }
    }

    /**
     * Signs out the current user by removing the JWT token from cookies.
     *
     * @param context - The context object containing request and response details.
     * @returns `true` if the sign-out operation was successful.
     */

    @Mutation(() => Boolean)
    async signOut(@Ctx() context: ContextType): Promise<boolean> {
        const cookies = new Cookies(context.req, context.res);

        cookies.set("token", "", { maxAge: -1 });
        return true;
    }

    /**
     * Retrieves the currently authenticated user based on the JWT token in the request context.
     *
     * @param context - The context object containing the authenticated user.
     * @returns The current authenticated user or `null` if the user is not authenticated.
     */

    @Query(() => User, { nullable: true })
    async whoami(@Ctx() context: ContextType) {
        return context.user;
    }
}
