import { BookReview } from "../../database/entities/book/bookReview";
import { BookRecommendation } from "../../database/entities/book/bookRecommendation";

/**
 * Re-mappe des lignes `{ key, value }` sur la liste de clés demandées,
 * en respectant l'ordre et en comblant les clés absentes par `fallback`.
 * (DataLoader exige un tableau aligné sur les clés en entrée.)
 */
export function mapRowsToKeys<K extends string | number, V>(
    keys: readonly K[],
    rows: { key: K; value: V }[],
    fallback: V,
): V[] {
    const byKey = new Map<K, V>(rows.map((r) => [r.key, r.value]));
    return keys.map((k) => byKey.get(k) ?? fallback);
}

export async function batchAverageRating(
    ids: readonly string[],
): Promise<(number | null)[]> {
    try {
        const raw = await BookReview.createQueryBuilder("review")
            .select("review.bookId", "bookId")
            .addSelect("AVG(review.rating)", "avg")
            .where("review.bookId IN (:...ids)", { ids })
            .groupBy("review.bookId")
            .getRawMany<{ bookId: string; avg: string }>();

        const rows = raw.map((r) => {
            const avg = Number(r.avg);
            return {
                key: r.bookId,
                value: Number.isFinite(avg)
                    ? parseFloat(avg.toFixed(2))
                    : null,
            };
        });
        return mapRowsToKeys<string, number | null>(ids, rows, null);
    } catch (error) {
        // Dégradation gracieuse : un échec DB ne casse pas la requête
        // catalogue, la carte s'affiche sans note (comportement historique).
        console.error("Error batching average ratings:", error);
        return ids.map(() => null);
    }
}

export async function batchReviewCount(
    ids: readonly string[],
): Promise<number[]> {
    try {
        const raw = await BookReview.createQueryBuilder("review")
            .select("review.bookId", "bookId")
            .addSelect("COUNT(*)", "count")
            .where("review.bookId IN (:...ids)", { ids })
            .groupBy("review.bookId")
            .getRawMany<{ bookId: string; count: string }>();

        const rows = raw.map((r) => ({
            key: r.bookId,
            value: Number(r.count),
        }));
        return mapRowsToKeys<string, number>(ids, rows, 0);
    } catch (error) {
        console.error("Error batching review counts:", error);
        return ids.map(() => 0);
    }
}

export async function batchRecommendationCount(
    ids: readonly string[],
): Promise<number[]> {
    try {
        const raw = await BookRecommendation.createQueryBuilder("reco")
            .select("reco.bookId", "bookId")
            .addSelect("COUNT(*)", "count")
            .where("reco.bookId IN (:...ids)", { ids })
            .groupBy("reco.bookId")
            .getRawMany<{ bookId: string; count: string }>();

        const rows = raw.map((r) => ({
            key: r.bookId,
            value: Number(r.count),
        }));
        return mapRowsToKeys<string, number>(ids, rows, 0);
    } catch (error) {
        console.error("Error batching recommendation counts:", error);
        return ids.map(() => 0);
    }
}
