export const Roles = {
    User: "user",
    Moderator: "moderator",
    Admin: "admin",
} as const;

export type UserRole = (typeof Roles)[keyof typeof Roles];

/**
 * Profil issu d'un ID token Google vérifié, consommé par le service d'auth
 * pour résoudre/créer l'utilisateur associé.
 */
export interface GoogleProfile {
    sub: string;
    email: string;
    name?: string | null;
    picture?: string | null;
}

export enum UserActionType {
    BOOK_ADDED = "BOOK_ADDED",
    AUTHOR_ADDED = "AUTHOR_ADDED",
    BOOK_ADDED_TO_LIBRARY = "BOOK_ADDED_TO_LIBRARY",
    BOOK_FINISHED = "BOOK_FINISHED",
    BOOK_RECOMMENDED = "BOOK_RECOMMENDED",
    REVIEW_CREATED = "REVIEW_CREATED",
    DETAILED_REVIEW_BONUS = "DETAILED_REVIEW_BONUS",
    REVIEW_VOTED_HELPFUL = "REVIEW_VOTED_HELPFUL",
    BOOK_IMPORTED = "BOOK_IMPORTED",
    BOOK_COMPLETED = "BOOK_COMPLETED",
    AUTHOR_COMPLETED = "AUTHOR_COMPLETED",
}
