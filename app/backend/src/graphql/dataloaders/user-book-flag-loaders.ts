import { BookReview } from "../../database/entities/book/bookReview";
import { BookRecommendation } from "../../database/entities/book/bookRecommendation";
import { UserBook } from "../../database/entities/user/user-book";
import { User } from "../../database/entities/user/user";

type GetUser = () => Promise<User | null | undefined>;

/**
 * Fabrique une batch function DataLoader pour un drapeau booléen par-livre
 * dépendant de l'utilisateur courant. Anonyme → tout false, zéro requête.
 */
export function makeUserFlagBatch(
    loadPositiveIds: (
        userId: string,
        bookIds: readonly string[],
    ) => Promise<Set<string>>,
    getUser: GetUser,
) {
    return async (bookIds: readonly string[]): Promise<boolean[]> => {
        try {
            const user = await getUser();
            if (!user) return bookIds.map(() => false);
            const positives = await loadPositiveIds(user.id, bookIds);
            return bookIds.map((id) => positives.has(id));
        } catch (error) {
            // Dégradation gracieuse : drapeau à false plutôt qu'une erreur
            // de champ qui casserait la requête catalogue.
            console.error("Error batching user book flags:", error);
            return bookIds.map(() => false);
        }
    };
}

export async function reviewedBookIds(
    userId: string,
    bookIds: readonly string[],
): Promise<Set<string>> {
    const rows = await BookReview.createQueryBuilder("review")
        .select("review.bookId", "bookId")
        .where("review.userId = :userId", { userId })
        .andWhere("review.bookId IN (:...bookIds)", { bookIds })
        .getRawMany<{ bookId: string }>();
    return new Set(rows.map((r) => r.bookId));
}

export async function recommendedBookIds(
    userId: string,
    bookIds: readonly string[],
): Promise<Set<string>> {
    const rows = await BookRecommendation.createQueryBuilder("reco")
        .select("reco.bookId", "bookId")
        .where("reco.userId = :userId", { userId })
        .andWhere("reco.bookId IN (:...bookIds)", { bookIds })
        .getRawMany<{ bookId: string }>();
    return new Set(rows.map((r) => r.bookId));
}

export async function libraryBookIds(
    userId: string,
    bookIds: readonly string[],
): Promise<Set<string>> {
    const rows = await UserBook.createQueryBuilder("userBook")
        .select("userBook.bookId", "bookId")
        .where("userBook.userId = :userId", { userId })
        .andWhere("userBook.bookId IN (:...bookIds)", { bookIds })
        .getRawMany<{ bookId: string }>();
    return new Set(rows.map((r) => r.bookId));
}
