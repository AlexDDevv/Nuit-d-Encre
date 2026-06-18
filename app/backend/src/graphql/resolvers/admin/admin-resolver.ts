/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * Resolvers réservés au panel d'administration : compteurs globaux, activité
 * récente du dashboard, liste complète des critiques et suppression de compte.
 * Toutes les opérations sont protégées par `@Authorized(Roles.Admin)`.
 */

import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { dataSource } from "../../../database/config/datasource";
import { User } from "../../../database/entities/user/user";
import { Book } from "../../../database/entities/book/book";
import { Author } from "../../../database/entities/author/author";
import { Category } from "../../../database/entities/category/category";
import { BookReview } from "../../../database/entities/book/bookReview";
import { BookReviewVote } from "../../../database/entities/book/bookReviewVote";
import { BookRecommendation } from "../../../database/entities/book/bookRecommendation";
import { UserBook } from "../../../database/entities/user/user-book";
import { UserActions } from "../../../database/entities/user/user-actions";
import { AdminStats } from "../../../database/filteredResults/admin/admin-stats";
import { AdminRecentActivity } from "../../../database/filteredResults/admin/admin-recent-activity";
import { AppError } from "../../../middlewares/error-handler";
import { Context, Roles } from "../../../types/types";

@Resolver()
export class AdminResolver {
    /**
     * Compteurs globaux de la plateforme (barre d'analytics).
     */
    @Authorized(Roles.Admin)
    @Query(() => AdminStats)
    async adminStats(): Promise<AdminStats> {
        const [users, books, authors, reviews, categories] = await Promise.all([
            User.count(),
            Book.count(),
            Author.count(),
            BookReview.count(),
            Category.count(),
        ]);

        return { users, books, authors, reviews, categories };
    }

    /**
     * Activité récente alimentant le dashboard : derniers inscrits, derniers
     * livres, dernières critiques et journal des 10 dernières actions XP.
     */
    @Authorized(Roles.Admin)
    @Query(() => AdminRecentActivity)
    async adminRecentActivity(): Promise<AdminRecentActivity> {
        const [recentUsers, recentBooks, recentReviews, actions] =
            await Promise.all([
                User.find({ order: { createdAt: "DESC" }, take: 5 }),
                Book.find({
                    order: { createdAt: "DESC" },
                    take: 5,
                    relations: { author: true, category: true, user: true },
                }),
                BookReview.find({
                    order: { createdAt: "DESC" },
                    take: 5,
                    relations: { user: true, book: { author: true } },
                }),
                UserActions.find({
                    order: { createdAt: "DESC" },
                    take: 10,
                    relations: { user: true },
                }),
            ]);

        const recentActions = actions.map((action) => ({
            id: action.id,
            type: action.type,
            xp: action.xp,
            metadata: action.metadata ?? null,
            targetId: action.targetId ?? null,
            createdAt: action.createdAt,
            userId: action.user?.id ?? "",
            userName: action.user?.userName ?? "Lecteur supprimé",
        }));

        return { recentUsers, recentBooks, recentReviews, recentActions };
    }

    /**
     * Liste complète des critiques (tri antéchronologique) pour l'onglet
     * Critiques. La recherche et la pagination sont gérées côté client.
     */
    @Authorized(Roles.Admin)
    @Query(() => [BookReview])
    async adminReviews(): Promise<BookReview[]> {
        return BookReview.find({
            order: { createdAt: "DESC" },
            relations: { user: true, book: { author: true } },
        });
    }

    /**
     * Suppression d'un compte utilisateur.
     *
     * @description
     * Supprime le compte ainsi que les contributions qui lui sont strictement
     * personnelles (critiques, votes, recommandations, bibliothèque, journal
     * XP), dans une transaction. Si l'utilisateur a ajouté des livres ou des
     * auteurs au catalogue (contenu partagé), la suppression est refusée afin
     * de préserver l'intégrité référentielle.
     */
    @Authorized(Roles.Admin)
    @Mutation(() => Boolean)
    async deleteUser(
        @Arg("id", () => ID) id: string,
        @Ctx() context: Context,
    ): Promise<boolean> {
        const currentUser = context.user;

        if (!currentUser) {
            throw new AppError("User not found", 404, "NotFoundError");
        }

        if (currentUser.id === id) {
            throw new AppError(
                "Vous ne pouvez pas supprimer votre propre compte.",
                400,
                "BadRequestError",
            );
        }

        const user = await User.findOne({
            where: { id },
            relations: { books: true, authors: true },
        });

        if (!user) {
            throw new AppError("User not found", 404, "NotFoundError");
        }

        if (user.books.length > 0 || user.authors.length > 0) {
            throw new AppError(
                "Ce compte a contribué au catalogue (livres ou auteurs). Réattribuez ou supprimez ces contributions avant de supprimer le compte.",
                409,
                "ConflictError",
            );
        }

        await dataSource.transaction(async (manager) => {
            await manager.delete(BookReviewVote, { user: { id } });
            await manager.delete(BookRecommendation, { user: { id } });
            await manager.delete(BookReview, { user: { id } });
            await manager.delete(UserBook, { user: { id } });
            await manager.delete(UserActions, { user: { id } });
            await manager.delete(User, { id });
        });

        return true;
    }
}
