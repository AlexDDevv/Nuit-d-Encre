import { ReactNode } from "react";
import { IconType } from "react-icons";

import { Author } from "./author";
import { User } from "./user";
import { CategoryBook } from "./category";
import { UserBookStatus } from "./user-book";

export type BookFormat = "hardcover" | "paperback" | "softcover" | "pocket";

export interface Book {
    id: string;
    title: string;
    author: Author;
    summary: string;
    publisher: string;
    publishedYear: number;
    language: string;
    pageCount: number;
    format: BookFormat;
    category: CategoryBook;
    isbn10?: string;
    isbn13: string;
    coverUrl?: string;
    isImported?: boolean;
    user: User;
    averageRating?: number;
    reviewCount?: number;
    recommendationCount?: number;
    hasUserReviewed?: boolean;
    hasUserRecommended?: boolean;
    isInLibrary?: boolean;
    createdAt?: string;
}

export type BookCardData = {
    id: string;
    title: string;
    author: {
        id: string;
        firstname: string;
        lastname: string;
    };
    isImported?: boolean;
    coverUrl?: string;
    publishedYear?: number;
    format?: BookFormat;
    category?: CategoryBook;
    averageRating?: number;
    reviewCount?: number;
    isInLibrary?: boolean;
};

export interface BookSearchResult {
    id?: string;
    title: string;
    author?: string;
    // Champs enrichis pour les résultats déjà en base (cartes harmonisées) :
    authorId?: string;
    // Nombre d'ouvrages de l'auteur déjà en base (signal « auteur connu » à l'import) :
    authorBookCount?: number;
    category?: string;
    format?: BookFormat;
    averageRating?: number;
    reviewCount?: number;
    isInLibrary?: boolean;
    isImported?: boolean;
    isbn13?: string;
    year?: number;
    publisher?: string;
    language?: string;
    coverUrl?: string;
    pageCount?: number;
    description?: string;
    isInDatabase: boolean;
    source?: "open_library" | "google_books";
}

export type CreateBookInput = {
    title: string;
    summary: string;
    author: string;
    isbn10?: string;
    isbn13: string;
    pageCount: number;
    publishedYear: number;
    language: string;
    publisher?: string;
    format: BookFormat | undefined;
    category: string;
};

export type UpdateBookInput = Partial<CreateBookInput> & { id: string };

export type UseBooksMode = {
    mode: "home" | "library";
};

export type LayoutOptionsValue = "grid" | "list" | "shelf";

export type LayoutOptions = {
    icon: IconType;
    label: string;
    value: LayoutOptionsValue;
};

/* ──────────────────────────── Props de composants ──────────────────────────── */

export type BookCardProps = {
    book: BookCardData;
    className?: string;
    isInAuthorPage?: boolean;
};

export type BookCardLibraryProps = {
    id: string;
    book: Book;
    status: UserBookStatus;
    isFavorite?: boolean;
    favoriteRank?: number | null;
    layout: LayoutOptionsValue;
    onStatusChange?: (args: {
        userBookId: string;
        bookId: string;
        status: UserBookStatus;
    }) => void;
    isUpdatingUserBook?: boolean;
    handleDeleteUserBook?: (userBookId: string) => void;
    isDeletingUserBook?: boolean;
};

export type BookShelfProps = {
    book: Book;
    status: UserBookStatus;
    isFavorite?: boolean;
    favoriteRank?: number | null;
};

export interface BookSearchResultsProps {
    dbResults: BookSearchResult[];
    externalResults: BookSearchResult[];
    isSearching: boolean;
    hasError?: boolean;
    query?: string;
}

export type BooksSectionLayoutProps = {
    title: string;
    seeMoreLink?: {
        to: string;
        ariaLabel: string;
    };
    className?: string;
    children: ReactNode;
};

export type LayoutButtonsProps = {
    activeLayout: LayoutOptionsValue;
    onLayoutChange: (layout: LayoutOptionsValue) => void;
};
