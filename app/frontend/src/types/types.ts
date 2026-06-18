import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { ReactNode } from "react";
import { IconType } from "react-icons";

// Miroir de l'enum backend (ne pas importer depuis app/backend :
// cela aspire les entités TypeORM décorées dans la compilation frontend).
export type UserRole = "user" | "moderator" | "admin";

export type AuthContextProps = {
    user: User | null;
    isLoading: boolean;
    refetchUser: () => void;
    logout: () => void;
};

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

export interface LinksType {
    className?: string;
    href: string;
    label: string;
    category: string;
    ariaLabel: string;
    Icon?: IconType;
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

export interface ErrorLayoutProps {
    children: React.ReactNode;
}

export type PaginationProps = {
    currentPage: number;
    totalCount: number;
    perPage: number;
    onPageChange: (page: number) => void;
    className?: string;
};

export type TypeSelectOptions = {
    value: string;
    label: string;
};

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

export interface Author {
    id: string;
    firstname: string;
    lastname: string;
    birthDate?: string;
    biography?: string;
    nationality?: string;
    wikipediaUrl?: string;
    officialWebsite?: string;
    books: Book[];
    bookCount?: number;
    createdAt?: string;
    user: User;
}

export type CreateAuthorInput = Author;

export type UpdateAuthorInput = Partial<CreateAuthorInput> & { id: string };

export type BookInputsProps = {
    register: UseFormRegister<CreateBookInput>;
    errors: FieldErrors<CreateBookInput>;
};

export type AuthorInputsProps = {
    register: UseFormRegister<CreateAuthorInput>;
    errors: FieldErrors<CreateAuthorInput>;
};

export type CategoryInputProps = {
    control: Control<CreateBookInput>;
    categoryOptions: TypeSelectOptions[];
    loadingCategories: boolean;
    errors: FieldErrors<CreateBookInput>;
};

export type InputIsbnProps = Pick<BookInputsProps, "register" | "errors"> & {
    isbn13: boolean;
};

export type BookFormat = "hardcover" | "paperback" | "softcover" | "pocket";
export type FormatInputProps = Pick<CategoryInputProps, "control" | "errors">;

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

export type BookCardProps = {
    book: BookCardData;
    className?: string;
    isInAuthorPage?: boolean;
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

export interface BookSearchResultsProps {
    dbResults: BookSearchResult[];
    externalResults: BookSearchResult[];
    isSearching: boolean;
    hasError?: boolean;
    query?: string;
}

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

export interface BookInfoProps {
    book: Book;
}

export interface CategoryBook {
    id: string;
    name: string;
}

export type AuthorCardProps = {
    id: string;
    firstname: string;
    lastname: string;
    isIncomplete?: boolean;
    nationality?: string;
    bookCount?: number;
};

export type RequiredAuthorFields =
    | "birthDate"
    | "nationality"
    | "wikipediaUrl"
    | "biography";

export interface AuthorInfoProps {
    author: Author;
}

export type GetCategoriesQuery = {
    categories: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    }[];
};

export type UseBooksMode = {
    mode: "home" | "library";
};

export type UseAuthorsMode = UseBooksMode;

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

export type UserBookStatus = "TO_READ" | "READING" | "READ" | "PAUSED";

export type UserBookStatusConfig = {
    icon: IconType;
    label: string;
    value: UserBookStatus;
};

export interface BookReview {
    id: string;
    rating: number;
    reviewText?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    book: Book;
    helpfulCount?: number;
    notHelpfulCount?: number;
}

export interface BookReviewsResult {
    reviews: BookReview[];
    totalCount: number;
    page: number;
    limit: number;
}

export type CreateBookReviewInput = {
    bookId: string;
    rating: number;
    reviewText?: string;
};

export type UpdateBookReviewInput = {
    id: string;
    rating?: number;
    reviewText?: string;
};

export enum BookReviewSortBy {
    RECENT = "RECENT",
    OLDEST = "OLDEST",
    RATING_HIGH = "RATING_HIGH",
    RATING_LOW = "RATING_LOW",
    HELPFUL = "HELPFUL",
}

export interface BookReviewVote {
    id: string;
    isHelpful: boolean;
    createdAt: string;
    user: User;
    review: BookReview;
}

enum BookReviewVoteAction {
    CREATED = "created",
    UPDATED = "updated",
    REMOVED = "removed",
}

export interface BookReviewVoteResult {
    vote: BookReviewVote | null;
    action: BookReviewVoteAction;
}

export type CreateBookReviewVoteInput = {
    reviewId: string;
    isHelpful: boolean;
};

export type SelectBookStatusProps = {
    value?: UserBookStatus;
    onChange?: (status: UserBookStatus) => void;
    disabled?: boolean;
    /** Colore le déclencheur selon le statut courant (utilisé dans la bibliothèque). */
    colored?: boolean;
    /** Classes supplémentaires pour le déclencheur (ex. largeur). */
    className?: string;
};

export type LayoutOptionsValue = "grid" | "list" | "shelf";

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

export type UserBookInfoProps = {
    category: string;
    averageRating?: number;
    reviewCount?: number;
    recommendationCount?: number;
    userBookId?: string;
    isFavorite?: boolean;
    favoriteRank?: number | null;
};

export type LayoutOptions = {
    icon: IconType;
    label: string;
    value: LayoutOptionsValue;
};

export type LayoutButtonsProps = {
    activeLayout: LayoutOptionsValue;
    onLayoutChange: (layout: LayoutOptionsValue) => void;
};

export type FilterUserBookStatusProps = {
    selectedStatus: UserBookStatus | "";
    onStatusChange: (status: UserBookStatus | "") => void;
};

export type FiltersUserBooksProps = FilterUserBookStatusProps & {
    searchParams: URLSearchParams;
    filters: string[];
    onClearAll: () => void;
};

export type SelectReviewSortProps = {
    value: BookReviewSortBy;
    onChange: (sortBy: BookReviewSortBy) => void;
    disabled?: boolean;
};

export const SORT_OPTIONS: { value: BookReviewSortBy; label: string }[] = [
    { value: BookReviewSortBy.HELPFUL, label: "Plus utiles" },
    { value: BookReviewSortBy.RECENT, label: "Plus récentes" },
    { value: BookReviewSortBy.OLDEST, label: "Plus anciennes" },
    { value: BookReviewSortBy.RATING_HIGH, label: "Note élevée" },
    { value: BookReviewSortBy.RATING_LOW, label: "Note basse" },
];

export type BooksSectionLayoutProps = {
    title: string;
    seeMoreLink?: {
        to: string;
        ariaLabel: string;
    };
    className?: string;
    children: ReactNode;
};

export interface BooksBibliographyProps {
    author: Author;
    excludedBookId?: string;
    fromAuthorPage?: boolean;
}

export interface BooksByCategoryProps {
    category: CategoryBook;
    books: Book[];
    excludedBookId?: string;
    excludedBookTitle?: string;
}

export interface RecommendationCountProps {
    count: number | undefined;
    className?: string;
    showIcon?: boolean;
    variant?: "primary" | "secondary" | "muted" | "outline" | "destructive";
    rounded?: boolean;
}

export interface Title {
    id: string;
    label: string;
    minLevel: number;
    iconKey: string;
    ornamentKey: string | null;
}

export interface FavoriteBookProps {
    isFavorite: boolean;
    favoriteRank: number | null;
}

export interface FavoriteBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    userBookId: string;
    book: Book;
    isFavorite: boolean;
    favoriteRank: number | null;
}

export interface SidebarLink {
    href: string;
    label: string;
    icon: IconType;
    ariaLabel: string;
}

export interface SidebarHeaderProps {
    collapsed: boolean;
    onToggle: () => void;
}

export interface LogoProps {
    to: string;
}

export interface SocialLink {
    icon: IconType;
    url: string;
    label: string;
}

export interface SidebarFooterProps {
    collapsed: boolean;
    isAuthenticated: boolean;
}

/* ──────────────────────────── Admin ──────────────────────────── */

export interface AdminStats {
    users: number;
    books: number;
    authors: number;
    reviews: number;
    categories: number;
}

export interface AdminStatsQuery {
    adminStats: AdminStats;
}

export interface AdminUserRow {
    id: string;
    userName: string;
    email: string;
    role: UserRole;
    level: number;
    xp: number;
    avatar: string | null;
    createdAt: string;
}

export interface AdminUsersQuery {
    getUsers: AdminUserRow[];
}

export interface AdminBookRow {
    id: string;
    title: string;
    isbn13: string;
    format: string;
    createdAt: string;
    author: { id: string; firstname: string; lastname: string };
    category: { id: string; name: string } | null;
    user: { id: string; userName: string } | null;
}

export interface AdminBooksQuery {
    books: { allBooks: AdminBookRow[]; totalCountAll: number };
}

export interface AdminAuthorRow {
    id: string;
    firstname: string;
    lastname: string;
    nationality: string | null;
    createdAt: string;
    books: { id: string }[];
    user: { id: string; userName: string } | null;
}

export interface AdminAuthorsQuery {
    authors: { allAuthors: AdminAuthorRow[]; totalCountAll: number };
}

export interface AdminCategoryRow {
    id: string;
    name: string;
    createdAt: string;
    createdBy: { id: string; userName: string } | null;
    books: { id: string }[];
}

export interface AdminCategoriesQuery {
    categories: AdminCategoryRow[];
}

export interface AdminReviewRow {
    id: string;
    rating: number;
    reviewText: string | null;
    createdAt: string;
    user: { id: string; userName: string; avatar: string | null };
    book: {
        id: string;
        title: string;
        author: { id: string; firstname: string; lastname: string };
    };
}

export interface AdminReviewsQuery {
    adminReviews: AdminReviewRow[];
}

export interface AdminActivityItem {
    id: string;
    type: UserActionType;
    xp: number;
    metadata: string | null;
    targetId: string | null;
    createdAt: string;
    userId: string;
    userName: string;
}

export interface AdminRecentActivity {
    recentUsers: {
        id: string;
        userName: string;
        email: string;
        avatar: string | null;
        role: UserRole;
        createdAt: string;
    }[];
    recentBooks: {
        id: string;
        title: string;
        createdAt: string;
        author: { id: string; firstname: string; lastname: string };
        category: { id: string; name: string } | null;
    }[];
    recentReviews: {
        id: string;
        rating: number;
        reviewText: string | null;
        createdAt: string;
        user: { id: string; userName: string; avatar: string | null };
        book: { id: string; title: string };
    }[];
    recentActions: AdminActivityItem[];
}

export interface AdminRecentActivityQuery {
    adminRecentActivity: AdminRecentActivity;
}

/* ── Bannière de site ──────────────────────────────────────────────────────
 * Les valeurs d'enum sont en majuscules : elles reflètent le schéma GraphQL
 * (TypeGraphQL expose les clés d'enum). Le mapping vers la variante du
 * composant Banner (minuscules) se fait via `@/lib/banner`. */

export type SiteBannerVariant = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
export type SiteBannerAudience = "ALL" | "AUTHENTICATED";

export interface SiteBanner {
    id: string;
    title: string;
    message: string | null;
    variant: SiteBannerVariant;
    audience: SiteBannerAudience;
    dismissible: boolean;
    actionLabel: string | null;
    actionUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ActiveSiteBannerQuery {
    activeSiteBanner: SiteBanner | null;
}

export interface SiteBannersQuery {
    siteBanners: SiteBanner[];
}
