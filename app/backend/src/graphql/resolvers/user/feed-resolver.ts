import {
    Arg,
    Authorized,
    Ctx,
    Int,
    Query,
    Resolver,
} from "type-graphql";
import { In } from "typeorm";
import { UserActions } from "../../../database/entities/user/user-actions";
import { UserFollow } from "../../../database/entities/user/user-follow";
import { AppError } from "../../../middlewares/error-handler";
import { Context } from "../../../types/types";
import { FeedEntry } from "./feed-entry";

/** Projette une action (avec sa relation `user`) vers un FeedEntry. */
export function toFeedEntry(action: UserActions): FeedEntry {
    return {
        id: action.id,
        type: action.type,
        metadata: action.metadata ?? null,
        targetId: action.targetId ?? null,
        createdAt: action.createdAt,
        actor: {
            id: action.user.id,
            userName: action.user.userName,
            avatar: action.user.avatar ?? null,
            level: action.user.level,
        },
    };
}

@Resolver()
export class FeedResolver {
    @Authorized()
    @Query(() => [FeedEntry])
    async activityFeed(
        @Arg("limit", () => Int, { defaultValue: 20 }) limit: number,
        @Arg("offset", () => Int, { defaultValue: 0 }) offset: number,
        @Ctx() context: Context,
    ): Promise<FeedEntry[]> {
        const me = context.user;
        if (!me) throw new AppError("Non authentifié", 401, "UnauthorizedError");

        const follows = await UserFollow.find({
            where: { follower: { id: me.id } },
            relations: { following: true },
        });
        const followingIds = follows.map((f) => f.following.id);
        if (followingIds.length === 0) return [];

        const actions = await UserActions.find({
            where: { user: { id: In(followingIds) } },
            relations: { user: true },
            order: { createdAt: "DESC" },
            take: Math.min(Math.max(limit, 1), 50),
            skip: Math.max(offset, 0),
        });
        return actions.map(toFeedEntry);
    }

    @Authorized()
    @Query(() => [FeedEntry])
    async globalActivityFeed(
        @Arg("limit", () => Int, { defaultValue: 20 }) limit: number,
    ): Promise<FeedEntry[]> {
        const actions = await UserActions.find({
            relations: { user: true },
            order: { createdAt: "DESC" },
            take: Math.min(Math.max(limit, 1), 50),
        });
        return actions.map(toFeedEntry);
    }
}
