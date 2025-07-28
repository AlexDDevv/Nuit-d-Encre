import Cookies from "cookies";
import { User } from "../database/entities/user/user";

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

export type BookFormat = "hardcover" | "paperback" | "softcover"

export enum UserActionType {
    BOOK_ADDED = "BOOK_ADDED",
    AUTHOR_ADDED = "AUTHOR_ADDED",
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

