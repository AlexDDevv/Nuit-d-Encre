import { LucideIcon } from "lucide-react";
import { UserRole } from "./../../../backend/src/types/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

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

export type AuthButtonsProps = {
    user: any;
    pathname: string;
    logout: () => void;
};

export interface ErrorLayoutProps {
    children: React.ReactNode;
}

export type PaginationProps = {
    currentPage: number
    totalCount: number
    perPage: number
    onPageChange: (page: number) => void
    className?: string
}

export type CategoryOption = {
    value: string
    label: string
}

export type CreateBookInput = {
    title: string;
    description: string;
    author: string;
    isbn10?: string;
    isbn13: string;
    pageCount: number;
    publishedYear: number;
    language: string;
    publisher?: string;
    format: BookFormat;
    category: number | string;
};

export type UpdateBookInput = Partial<CreateBookInput> & { id: number };

export type InputsProps = {
    register: UseFormRegister<CreateBookInput>
    errors: FieldErrors<CreateBookInput>
}

export type BookFormat = "hardcover" | "paperback" | "softcover"

