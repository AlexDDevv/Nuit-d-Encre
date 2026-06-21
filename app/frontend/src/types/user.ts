// Miroir de l'enum backend (ne pas importer depuis app/backend :
// cela aspire les entités TypeORM décorées dans la compilation frontend).
export type UserRole = "user" | "moderator" | "admin";

export interface Title {
    id: string;
    label: string;
    minLevel: number;
    iconKey: string;
    ornamentKey: string | null;
}

export interface User {
    id: string;
    userName: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
    createdAt?: string;
    level: number;
    xp: number;
    avatar: string | null;
    banner: string | null;
    bio: string | null;
    title: Title | null;
}

export type UserActionType =
    | "BOOK_ADDED"
    | "AUTHOR_ADDED"
    | "BOOK_ADDED_TO_LIBRARY"
    | "BOOK_FINISHED"
    | "BOOK_RECOMMENDED"
    | "REVIEW_CREATED"
    | "DETAILED_REVIEW_BONUS"
    | "REVIEW_VOTED_HELPFUL"
    | "BOOK_IMPORTED"
    | "BOOK_COMPLETED"
    | "AUTHOR_COMPLETED";

export interface UserAction {
    type: UserActionType;
    xp: number;
    createdAt: string;
    metadata: string | null;
}

export interface UserAuth {
    userName: string;
    email: string;
    password: string;
    role: UserRole;
}

export type UserSignUp = UserAuth;
export type UserSignIn = Pick<UserAuth, "email" | "password">;
export type UserSignForm = UserSignUp | UserSignIn;
