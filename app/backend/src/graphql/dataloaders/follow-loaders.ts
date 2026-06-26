import { In } from "typeorm";
import { UserFollow } from "../../database/entities/user/user-follow";
import { User } from "../../database/entities/user/user";
import { mapRowsToKeys } from "./book-aggregate-loaders";

type GetUser = () => Promise<User | null | undefined>;

/** Nombre d'abonnés (relations où l'id est `following`). */
export async function batchFollowerCount(
    ids: readonly string[],
): Promise<number[]> {
    try {
        const raw = await UserFollow.createQueryBuilder("f")
            .select("f.followingId", "userId")
            .addSelect("COUNT(*)", "count")
            .where("f.followingId IN (:...ids)", { ids })
            .groupBy("f.followingId")
            .getRawMany<{ userId: string; count: string }>();
        const rows = raw.map((r) => ({ key: r.userId, value: Number(r.count) }));
        return mapRowsToKeys<string, number>(ids, rows, 0);
    } catch (error) {
        console.error("Error batching follower counts:", error);
        return ids.map(() => 0);
    }
}

/** Nombre d'abonnements (relations où l'id est `follower`). */
export async function batchFollowingCount(
    ids: readonly string[],
): Promise<number[]> {
    try {
        const raw = await UserFollow.createQueryBuilder("f")
            .select("f.followerId", "userId")
            .addSelect("COUNT(*)", "count")
            .where("f.followerId IN (:...ids)", { ids })
            .groupBy("f.followerId")
            .getRawMany<{ userId: string; count: string }>();
        const rows = raw.map((r) => ({ key: r.userId, value: Number(r.count) }));
        return mapRowsToKeys<string, number>(ids, rows, 0);
    } catch (error) {
        console.error("Error batching following counts:", error);
        return ids.map(() => 0);
    }
}

/**
 * Fabrique le batch « est-ce que l'utilisateur courant suit ces ids ? ».
 * Anonyme → tout false, zéro requête (même pattern que les flags livre).
 */
export function makeIsFollowedByMeBatch(getUser: GetUser) {
    return async (ids: readonly string[]): Promise<boolean[]> => {
        try {
            const me = await getUser();
            if (!me) return ids.map(() => false);
            const rows = await UserFollow.find({
                where: { follower: { id: me.id }, following: { id: In([...ids]) } },
                relations: { following: true },
            });
            const followed = new Set(rows.map((r) => r.following.id));
            return ids.map((id) => followed.has(id));
        } catch (error) {
            console.error("Error batching isFollowedByMe:", error);
            return ids.map(() => false);
        }
    };
}
