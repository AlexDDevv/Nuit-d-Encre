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

export type CreateAuthorInput = {
    firstname: string;
    lastname: string;
    birthdate?: string;
    nationality?: string;
    wikipediaUrl: string;
    officialWebsite?: string;
};

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
};

interface Book {
    publisher: string;
    publishedYear: number;
    language: string;
    pageCount: number;
    format: string;
    category: {
        name: string;
    };
    isbn10?: string;
    isbn13: string;
}

export interface BookInfoProps {
    book: Book;
}

export type categoryPropsType = {
    id: string;
    name: string;
};

interface Author {
    birthdate?: string
    nationality?: string
    wikipediaUrl?: string
    officialWebsite?: string
}

export type AuthorCardProps = {
    id: string;
    firstname: string;
    lastname: string;
    isIncomplete?: boolean;
};

export interface AuthorInfoProps {
    author: Author;
}
