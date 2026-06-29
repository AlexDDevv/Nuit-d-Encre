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

export interface FollowButtonProps {
    targetId: string;
    isFollowedByMe: boolean;
}

export interface FollowListModalProps {
    userId: string;
    mode: "followers" | "following";
    onClose: () => void;
}

/* ──────────────────────────── Primitives UI génériques ──────────────────────────── */

export interface SegmentedOption<T extends string> {
    value: T;
    label: string;
    icon?: IconType;
    disabled?: boolean;
    tooltip?: string;
}

export interface SegmentedTabsProps<T extends string> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    ariaLabel: string;
    /** Onglets à largeur égale (sinon dimensionnés au contenu). */
    fullWidth?: boolean;
    className?: string;
}

export interface ChipOption<T extends string> {
    value: T;
    label: string;
    icon?: IconType;
}

export interface FilterChipsProps<T extends string> {
    options: ChipOption<T>[];
    value: T;
    onChange: (value: T) => void;
    ariaLabel: string;
    className?: string;
}

export interface LevelBadgeProps {
    level: number;
    className?: string;
}
