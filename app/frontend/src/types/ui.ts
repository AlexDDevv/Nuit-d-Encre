import { IconType } from "react-icons";

export type TypeSelectOptions = {
    value: string;
    label: string;
};

export type PaginationProps = {
    currentPage: number;
    totalCount: number;
    perPage: number;
    onPageChange: (page: number) => void;
    className?: string;
};

/* ──────────────────────────── Navigation (sidebar) ──────────────────────────── */

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

export interface SidebarFooterProps {
    collapsed: boolean;
    isAuthenticated: boolean;
}

export interface LogoProps {
    to: string;
}

export interface SocialLink {
    icon: IconType;
    url: string;
    label: string;
    /** Displayed handle (e.g. "@Sport_DevWeb") - used by the Contact page. */
    handle?: string;
}

export interface UserLinkProps {
    id: string;
    userName: string;
    avatar?: string | null;
    size?: "sm" | "md";
    className?: string;
}
