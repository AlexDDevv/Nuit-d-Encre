import { IconType } from "react-icons";

import { Book } from "./book";
import { User } from "./user";

export type UserBookStatus = "TO_READ" | "READING" | "READ" | "PAUSED";

export interface UserBook {
    id: string;
    book: Book;
    user: User;
    status: UserBookStatus;
    startedAt?: string;
    finishedAt?: string;
    isPublic?: boolean;
    isFavorite: boolean;
    favoriteRank: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserBookInput {
    bookId: string;
    status: UserBookStatus;
    startedAt?: string;
    finishedAt?: string;
    isPublic?: boolean;
}

export interface UpdateUserBookInput {
    id?: string;
    status?: UserBookStatus;
    startedAt?: string;
    finishedAt?: string;
    isPublic?: boolean;
}

export type UserBookStatusConfig = {
    icon: IconType;
    label: string;
    value: UserBookStatus;
};

/* ──────────────────────────── Props de composants ──────────────────────────── */

export type SelectBookStatusProps = {
    value?: UserBookStatus;
    onChange?: (status: UserBookStatus) => void;
    disabled?: boolean;
    /** Colore le déclencheur selon le statut courant (utilisé dans la bibliothèque). */
    colored?: boolean;
    /** Classes supplémentaires pour le déclencheur (ex. largeur). */
    className?: string;
};

export interface FavoriteBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    userBookId: string;
    book: Book;
    isFavorite: boolean;
    favoriteRank: number | null;
}
