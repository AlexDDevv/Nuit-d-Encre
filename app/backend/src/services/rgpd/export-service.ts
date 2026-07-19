import { User } from "../../database/entities/user/user";
import { AppError } from "../../middlewares/error-handler";

/**
 * Rassemble toutes les données personnelles d'un utilisateur en un JSON
 * structuré et lisible (droit d'accès art. 15 + portabilité art. 20).
 * Le mot de passe haché et le googleId ne sont jamais inclus.
 */
export const exportUserData = async (userId: string): Promise<string> => {
    const user = await User.findOne({
        where: { id: userId },
        relations: {
            userBooks: { book: true },
            bookReviews: true,
            bookRecommendations: true,
            bookReviewVotes: true,
            actions: true,
            following: true,
            followers: true,
            books: true,
            authors: true,
        },
    });

    if (!user) {
        throw new AppError("User not found", 404, "NotFoundError");
    }

    const payload = {
        exportDate: new Date().toISOString(),
        profil: {
            id: user.id,
            email: user.email,
            userName: user.userName,
            bio: user.bio ?? null,
            avatar: user.avatar ?? null,
            banner: user.banner ?? null,
            level: user.level,
            xp: user.xp,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        bibliotheque: user.userBooks ?? [],
        critiques: user.bookReviews ?? [],
        recommandations: user.bookRecommendations ?? [],
        votes: user.bookReviewVotes ?? [],
        journalActivite: user.actions ?? [],
        abonnements: (user.following ?? []).length,
        abonnes: (user.followers ?? []).length,
        livresAjoutes: user.books ?? [],
        auteursAjoutes: user.authors ?? [],
    };

    return JSON.stringify(payload, null, 2);
};
