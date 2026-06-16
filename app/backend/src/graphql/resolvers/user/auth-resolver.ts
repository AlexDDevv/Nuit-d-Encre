import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from "type-graphql";
import { LogInResponse, User } from "../../../database/entities/user/user";
import { CreateUserInput } from "../../inputs/create/user/create-auth-input";
import { AppError } from "../../../middlewares/error-handler";
import {
    login,
    register,
    whoami,
    updateProfile,
    changePassword,
    updateAvatar,
    updateBanner,
    removeAvatar,
    removeBanner,
} from "../../../services/auth-service";
import { Context, Roles } from "../../../types/types";
import { enforceRateLimit } from "../../../middlewares/rate-limiter";
import { LogUserInput } from "../../inputs/create/user/create-auth-input";
import { UpdateProfileInput } from "../../inputs/update/user/update-profile-input";
import { CloudinaryService } from "../../../services/cloudinary.service";

// Accepte une data URI d'image base64 (ex. "data:image/png;base64,...").
const isImageDataUri = (value: string): boolean =>
    /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);

/**
 * AuthResolver handles all authentication-related GraphQL mutations and queries.
 */

@Resolver(User)
export class AuthResolver {
    private cloudinaryService = new CloudinaryService();

    /**
     * Mutation for user registration.
     *
     * @param data - The input data containing the user's email, password, userName and role.
     * @param context - The context object that contains cookies for session management.
     *
     * @returns A Promise that resolves to the newly created User object.
     *
     * @throws AppError If the email is already in use or if there is any other error during registration.
     */
    @Mutation(() => User)
    async register(
        @Arg("data") data: CreateUserInput, // Input object containing email and password
        @Ctx() context: Context,
    ): Promise<User> {
        try {
            enforceRateLimit("register", context.ip);

            const { email, password, userName } = data;

            return await register(email, password, userName, Roles.User);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Registration failed", 400, "InternalError");
        }
    }

    /**
     * Mutation for user login.
     *
     * @param data - The input data containing the user's email and password.
     * @param context - The context object that contains cookies for session management.
     *
     * @returns A Promise that resolves to a LogInResponse object containing a message and cookie status.
     *
     * @throws AppError If there is any error during the login process, such as invalid credentials.
     */
    @Mutation(() => LogInResponse)
    async login(
        @Arg("data") data: LogUserInput, // Input object containing email and password
        @Ctx() context: Context, // Context object containing cookies
    ): Promise<LogInResponse> {
        // Outside the try: the catch below maps everything to 401, which
        // would otherwise mask the 429 rate-limit error.
        enforceRateLimit("login", context.ip);

        try {
            const { email, password } = data;

            // Get the cookies from the context
            const { cookies } = context;

            // Check if the cookies are available
            if (!cookies) {
                throw new AppError(
                    "Cookies context not available",
                    500,
                    "InternalServerError",
                );
            }

            const loginResponse = await login(email, password, cookies);

            return {
                message: loginResponse.message,
                cookieSet: loginResponse.cookieSet,
            };
        } catch (error) {
            throw new AppError("Login failed", 401, "UnauthorizedError"); // Handle login errors
        }
    }

    /**
     * Mutation for logging out the user by clearing the authentication token cookie.
     *
     * @param context - The context object that contains cookies for session management.
     *
     * @returns A string message confirming successful logout.
     */
    @Authorized()
    @Mutation(() => String)
    async logout(@Ctx() context: Context): Promise<string> {
        const { cookies } = context;

        // Remove the token cookie
        cookies.set("token", "", { maxAge: -1 });

        return "Logged out successfully";
    }

    /**
     * Query to get the currently authenticated user.
     *
     * @param context - The context object that contains cookies for session management.
     *
     * @returns A Promise that resolves to the current User object.
     *
     * @throws AppError If no user is found or if there is any error in the process.
     */
    @Authorized()
    @Query(() => User)
    async whoami(@Ctx() context: Context): Promise<User> {
        const { cookies } = context;

        const user = await whoami(cookies);

        if (!user) throw new AppError("User not found", 404, "NotFoundError");

        return user;
    }

    /**
     * Query to get all users in the system.
     *
     * @returns A Promise that resolves to an array of User objects, or a string indicating an error.
     */
    @Query(() => [User])
    @Authorized(Roles.Admin)
    async getUsers(): Promise<User[]> {
        return User.find();
    }

    @Authorized()
    @Mutation(() => User)
    async updateProfile(
        @Arg("data") data: UpdateProfileInput,
        @Ctx() context: Context,
    ): Promise<User> {
        try {
            const user = context.user;

            if (!user)
                throw new AppError("User not found", 404, "NotFoundError");

            return await updateProfile(user.id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to update profile",
                500,
                "InternalServerError",
            );
        }
    }

    @Authorized()
    @Mutation(() => Boolean)
    async changePassword(
        @Arg("currentPassword") currentPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() context: Context,
    ): Promise<boolean> {
        try {
            const user = context.user;

            if (!user)
                throw new AppError("User not found", 404, "NotFoundError");

            return await changePassword(user.id, currentPassword, newPassword);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to change password",
                500,
                "InternalServerError",
            );
        }
    }

    @Authorized()
    @Mutation(() => User)
    async updateAvatar(
        @Arg("data") data: string,
        @Ctx() context: Context,
    ): Promise<User> {
        try {
            const user = context.user;

            if (!user)
                throw new AppError("User not found", 404, "NotFoundError");

            if (!isImageDataUri(data))
                throw new AppError("Invalid image", 400, "ValidationError");

            const url = await this.cloudinaryService.uploadImage(
                data,
                `users/${user.id}/avatar`,
            );

            if (!url)
                throw new AppError(
                    "Failed to upload avatar",
                    502,
                    "InternalServerError",
                );

            return await updateAvatar(user.id, url);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to update avatar",
                500,
                "InternalServerError",
            );
        }
    }

    @Authorized()
    @Mutation(() => User)
    async updateBanner(
        @Arg("data") data: string,
        @Ctx() context: Context,
    ): Promise<User> {
        try {
            const user = context.user;

            if (!user)
                throw new AppError("User not found", 404, "NotFoundError");

            if (!isImageDataUri(data))
                throw new AppError("Invalid image", 400, "ValidationError");

            const url = await this.cloudinaryService.uploadImage(
                data,
                `users/${user.id}/banner`,
            );
            
            if (!url)
                throw new AppError(
                    "Failed to upload banner",
                    502,
                    "InternalServerError",
                );

            return await updateBanner(user.id, url);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to update banner",
                500,
                "InternalServerError",
            );
        }
    }

    @Authorized()
    @Mutation(() => User)
    async removeAvatar(@Ctx() context: Context): Promise<User> {
        try {
            const user = context.user;

            if (!user)
                throw new AppError("User not found", 404, "NotFoundError");

            await this.cloudinaryService.deleteImage(`users/${user.id}/avatar`);
            return await removeAvatar(user.id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to remove avatar",
                500,
                "InternalServerError",
            );
        }
    }

    @Authorized()
    @Mutation(() => User)
    async removeBanner(@Ctx() context: Context): Promise<User> {
        try {
            const user = context.user;

            if (!user)
                throw new AppError("User not found", 404, "NotFoundError");

            await this.cloudinaryService.deleteImage(`users/${user.id}/banner`);
            return await removeBanner(user.id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to remove banner",
                500,
                "InternalServerError",
            );
        }
    }
}
