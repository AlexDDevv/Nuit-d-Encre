import { Book, UseBooksMode } from "./book";
import { User } from "./user";

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

export type RequiredAuthorFields =
    | "birthDate"
    | "nationality"
    | "wikipediaUrl"
    | "biography";

export type UseAuthorsMode = UseBooksMode;

/* ──────────────────────────── Props de composants ──────────────────────────── */

export type AuthorCardProps = {
    id: string;
    firstname: string;
    lastname: string;
    isIncomplete?: boolean;
    nationality?: string;
    bookCount?: number;
};
