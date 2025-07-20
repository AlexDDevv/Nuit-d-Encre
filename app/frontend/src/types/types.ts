import { LucideIcon } from "lucide-react";
import { UserRole } from "./../../../backend/src/types/types";

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
