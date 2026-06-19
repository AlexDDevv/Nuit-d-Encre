import DataLoader from "dataloader";
import { User } from "../../database/entities/user/user";
import { Title } from "../../database/entities/gamification/title";
import {
    batchAverageRating,
    batchReviewCount,
    batchRecommendationCount,
} from "./book-aggregate-loaders";
import { batchTitles } from "./title-loader";
import {
    makeUserFlagBatch,
    reviewedBookIds,
    recommendedBookIds,
    libraryBookIds,
} from "./user-book-flag-loaders";

export type Loaders = {
    averageRating: DataLoader<string, number | null>;
    reviewCount: DataLoader<string, number>;
    recommendationCount: DataLoader<string, number>;
    title: DataLoader<number, Title | null>;
    hasUserReviewed: DataLoader<string, boolean>;
    hasUserRecommended: DataLoader<string, boolean>;
    isInLibrary: DataLoader<string, boolean>;
};

/**
 * Construit un jeu de DataLoaders neuf pour UNE requête HTTP.
 * Ne jamais partager entre requêtes : le cache par-loader mélangerait
 * les données entre utilisateurs.
 *
 * @param getUser - résolution mémoïsée (lazy) de l'utilisateur courant.
 */
export function createLoaders(
    getUser: () => Promise<User | null | undefined>,
): Loaders {
    return {
        averageRating: new DataLoader((ids) => batchAverageRating(ids)),
        reviewCount: new DataLoader((ids) => batchReviewCount(ids)),
        recommendationCount: new DataLoader((ids) =>
            batchRecommendationCount(ids),
        ),
        title: new DataLoader((levels) => batchTitles(levels)),
        hasUserReviewed: new DataLoader(
            makeUserFlagBatch(reviewedBookIds, getUser),
        ),
        hasUserRecommended: new DataLoader(
            makeUserFlagBatch(recommendedBookIds, getUser),
        ),
        isInLibrary: new DataLoader(
            makeUserFlagBatch(libraryBookIds, getUser),
        ),
    };
}
