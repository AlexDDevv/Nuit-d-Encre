/**
 * Clés de déduplication de l'XP (cf. `grantXpService`). Elles désignent ce qui
 * est récompensé de façon stable : l'id du livre plutôt que celui d'une entrée
 * de bibliothèque ou d'une critique, qu'on peut supprimer puis recréer.
 */
export const xpKeys = {
    book: (bookId: string) => `book:${bookId}`,
    isbn13: (isbn13: string) => `isbn13:${isbn13}`,
    author: (authorId: string) => `author:${authorId}`,
    helpfulVote: (reviewId: string, voterId: string) =>
        `review:${reviewId}:voter:${voterId}`,
};
