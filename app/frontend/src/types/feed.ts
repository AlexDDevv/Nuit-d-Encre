import { ActivityKind, FeedEntry } from "./user";

/** Source du fil : lecteurs suivis ou communauté entière. */
export type FeedTab = "abonnements" | "communaute";

/** Filtre du fil : toutes les catégories, ou une seule. */
export type ActivityFilter = ActivityKind | "all";

export interface FeedAvatarProps {
    userName: string;
    avatar?: string | null;
    tone?: "gold" | "deep";
    className?: string;
}

export interface FeedRowProps {
    entry: FeedEntry;
    discovery?: boolean;
}

export interface FeedTargetLinkProps {
    entry: FeedEntry;
}

export interface FeedTimeSeparatorProps {
    label: string;
    discovery?: boolean;
}

export interface FeedTabsProps {
    value: FeedTab;
    onChange: (tab: FeedTab) => void;
    locked?: boolean;
}

export interface FeedFilterBarProps {
    value: ActivityFilter;
    onChange: (filter: ActivityFilter) => void;
}

export interface FeedListProps {
    entries: FeedEntry[];
    discovery?: boolean;
    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;
}
