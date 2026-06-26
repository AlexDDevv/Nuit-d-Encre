import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    ID,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { User } from "../../../database/entities/user/user";
import { UserFollow } from "../../../database/entities/user/user-follow";
import { AppError } from "../../../middlewares/error-handler";
import { Context } from "../../../types/types";

@Resolver(() => User)
export class FollowResolver {
    @Authorized()
    @Mutation(() => Boolean)
    async followUser(
        @Arg("userId", () => ID) userId: string,
        @Ctx() context: Context,
    ): Promise<boolean> {
        const me = context.user;
        if (!me) throw new AppError("Non authentifié", 401, "UnauthorizedError");
        if (userId === me.id) {
            throw new AppError("Impossible de se suivre soi-même", 400, "BadUserInput");
        }
        const target = await User.findOne({ where: { id: userId } });
        if (!target) throw new AppError("Utilisateur introuvable", 404, "NotFoundError");

        try {
            await UserFollow.insert({
                follower: { id: me.id },
                following: { id: userId },
            });
        } catch (error: unknown) {
            // 23505 = violation de contrainte unique → déjà suivi, idempotent.
            if ((error as { code?: string })?.code === "23505") return true;
            throw error;
        }
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean)
    async unfollowUser(
        @Arg("userId", () => ID) userId: string,
        @Ctx() context: Context,
    ): Promise<boolean> {
        const me = context.user;
        if (!me) throw new AppError("Non authentifié", 401, "UnauthorizedError");
        await UserFollow.delete({
            follower: { id: me.id },
            following: { id: userId },
        });
        return true;
    }

    @FieldResolver(() => Int)
    async followerCount(
        @Root() user: User,
        @Ctx() context: Context,
    ): Promise<number> {
        return context.loaders.followerCount.load(user.id);
    }

    @FieldResolver(() => Int)
    async followingCount(
        @Root() user: User,
        @Ctx() context: Context,
    ): Promise<number> {
        return context.loaders.followingCount.load(user.id);
    }

    @FieldResolver(() => Boolean)
    async isFollowedByMe(
        @Root() user: User,
        @Ctx() context: Context,
    ): Promise<boolean> {
        return context.loaders.isFollowedByMe.load(user.id);
    }

    @Query(() => [User])
    async followers(
        @Arg("userId", () => ID) userId: string,
    ): Promise<User[]> {
        const rows = await UserFollow.find({
            where: { following: { id: userId } },
            relations: { follower: true },
            order: { createdAt: "DESC" },
            take: 100,
        });
        return rows.map((r) => r.follower);
    }

    @Query(() => [User])
    async following(
        @Arg("userId", () => ID) userId: string,
    ): Promise<User[]> {
        const rows = await UserFollow.find({
            where: { follower: { id: userId } },
            relations: { following: true },
            order: { createdAt: "DESC" },
            take: 100,
        });
        return rows.map((r) => r.following);
    }
}
