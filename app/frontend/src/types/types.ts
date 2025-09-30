import { LucideIcon } from "lucide-react";
import { UserRole } from "./../../../backend/src/types/types";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

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
}

export interface LinksType {
    className?: string;
    href: string;
    label: string;
    category: string;
    ariaLabel: string;
    Icon?: LucideIcon;
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
    category: number | string;
};

export type UpdateBookInput = Partial<CreateBookInput> & { id: number };

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
    user: User;
}

export type CreateAuthorInput = Author;

export type UpdateAuthorInput = Partial<CreateAuthorInput> & { id: number };

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

export type BookCardProps = {
    id: string;
    title: string;
    author: {
        id: string;
        firstname: string;
        lastname: string;
    };
    className?: string;
    isInAuthorPage?: boolean;
};

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
    user: User;
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
    rating?: number;
    review?: string;
    recommended?: boolean;
    startedAt?: string;
    finishedAt?: string;
    isPublic?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserBookInput {
    bookId: string;
    status: UserBookStatus;
    rating?: number;
    review?: string;
    recommended?: boolean;
    startedAt?: string;
    finishedAt?: string;
    isPublic?: boolean;
}

export type UserBookStatus = "TO_READ" | "READING" | "READ" | "PAUSED";

export type UserBookStatusConfig = {
    icon: LucideIcon;
    label: string;
    value: UserBookStatus;
};

export type SelectBookStatusProps = {
    bookId: string;
    status?: UserBookStatus;
};

export type BookCardLibraryProps = {
    id: string;
    book: {
        title: string;
        author: {
            firstname: string;
            lastname: string;
        };
        publishedYear: number;
        publisher: string;
        pageCount: number;
        category: CategoryBook;
    };
    rating: number;
    recommended: boolean;
    status: UserBookStatus;
};
