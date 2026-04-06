import Cookies from "cookies";
import { User } from "../database/entities/user/user";
import { registerEnumType } from "type-graphql";

export type Context = {
    cookies: Cookies;
    user: User | null | undefined;
};

export const Roles = {
    User: "user",
    Moderator: "moderator",
    Admin: "admin",
} as const;

export type UserRole = (typeof Roles)[keyof typeof Roles];

export type BookFormat = "hardcover" | "paperback" | "softcover" | "pocket";

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
}

export type XPResultType = {
    newXP: number;
    newLevel: number;
    levelUp: boolean;
};

export type GrantXPOptions = {
    targetId?: string;
    metadata?: Record<string, any>;
};

export interface AuthorNameParts {
    firstname: string;
    lastname: string;
}

export enum ReadingStatus {
    TO_READ = "to_read",
    READING = "reading",
    READ = "read",
    PAUSED = "paused",
}

export enum BookReviewSortBy {
    RECENT = "RECENT",
    OLDEST = "OLDEST",
    RATING_HIGH = "RATING_HIGH",
    RATING_LOW = "RATING_LOW",
    HELPFUL = "HELPFUL",
}

registerEnumType(BookReviewSortBy, {
    name: "BookReviewSortBy",
    description: "Sort options for book reviews",
});

interface GoogleBooksIdentifier {
    type: string;
    identifier: string;
}

interface GoogleBooksVolumeInfo {
    title: string;
    authors?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    language?: string;
    imageLinks?: { thumbnail?: string };
    industryIdentifiers?: GoogleBooksIdentifier[];
}

export interface GoogleBooksVolume {
    volumeInfo: GoogleBooksVolumeInfo;
}

export interface GoogleBooksResponse {
    items?: GoogleBooksVolume[];
}
