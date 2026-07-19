import { dataSource } from "../../database/config/datasource";
import { Author } from "../../database/entities/author/author";
import { Book } from "../../database/entities/book/book";
import { BookRecommendation } from "../../database/entities/book/bookRecommendation";
import { BookReview } from "../../database/entities/book/bookReview";
import { BookReviewComment } from "../../database/entities/book/bookReviewComment";
import { BookReviewVote } from "../../database/entities/book/bookReviewVote";
import { Category } from "../../database/entities/category/category";
import { User } from "../../database/entities/user/user";
import { UserActions } from "../../database/entities/user/user-actions";
import type { EntityManager } from "typeorm";

// Détache une contribution de son auteur en mettant la FK userId à NULL,
// sans supprimer la ligne (anonymisation / conservation au catalogue).
const detachUser = (
    manager: EntityManager,
    entity: Function,
    column: string,
    userId: string,
): Promise<unknown> =>
    manager
        .createQueryBuilder()
        .update(entity as any)
        .set({ [column]: null })
        .where(`"${column}Id" = :userId`, { userId })
        .execute();

/**
 * Efface un compte utilisateur de façon conforme au RGPD (art. 17), en une
 * seule transaction :
 * - supprime les données strictement personnelles (votes, journal d'activité) ;
 * - anonymise les contributions publiques (critiques, recommandations,
 *   commentaires) en détachant l'identité (userId -> NULL) ;
 * - détache les contributions au catalogue (livres, auteurs, catégories créées) ;
 * - supprime le compte, ce qui déclenche la cascade sur user_book et user_follow.
 */
export const eraseUserAccount = async (userId: string): Promise<void> => {
    await dataSource.transaction(async (manager) => {
        // 1. Données strictement personnelles : suppression.
        await manager.delete(BookReviewVote, { user: { id: userId } });
        await manager.delete(UserActions, { user: { id: userId } });

        // 2. Contributions publiques : anonymisation (SET NULL).
        await detachUser(manager, BookReview, "user", userId);
        await detachUser(manager, BookRecommendation, "user", userId);
        await detachUser(manager, BookReviewComment, "user", userId);

        // 3. Catalogue partagé : détachement (conservé).
        await detachUser(manager, Book, "user", userId);
        await detachUser(manager, Author, "user", userId);
        await detachUser(manager, Category, "createdBy", userId);

        // 4. Compte : suppression (cascade user_book + user_follow).
        await manager.delete(User, { id: userId });
    });
};
