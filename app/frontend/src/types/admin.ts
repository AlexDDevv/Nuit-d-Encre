import { UserRole, UserActionType } from "./user";

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
