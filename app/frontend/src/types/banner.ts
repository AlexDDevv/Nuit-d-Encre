/* ── Bannière de site ──────────────────────────────────────────────────────
 * Les valeurs d'enum sont en majuscules : elles reflètent le schéma GraphQL
 * (TypeGraphQL expose les clés d'enum). Le mapping vers la variante du
 * composant Banner (minuscules) se fait via `@/lib/banner`. */

export type SiteBannerVariant = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
export type SiteBannerAudience = "ALL" | "AUTHENTICATED";

/** Variantes éditables d'une bannière de site (hors `completion`, réservée à la gamification). */
export type BannerEditorVariant = "info" | "success" | "warning" | "error";

/** Bannière enregistrée, projetée pour la liste d'historique. */
export interface SavedBanner {
    id: string;
    variant: BannerEditorVariant;
    title: string;
    content: string;
    audience: SiteBannerAudience;
    dismissible: boolean;
    action: { label: string; target: string } | null;
    date: string;
}

/** Brouillon en cours d'édition. */
export interface BannerDraft {
    variant: BannerEditorVariant;
    title: string;
    content: string;
    audience: SiteBannerAudience;
    hasAction: boolean;
    actionLabel: string;
    actionTarget: string;
    dismissible: boolean;
}

export interface SiteBanner {
    id: string;
    title: string;
    message: string | null;
    variant: SiteBannerVariant;
    audience: SiteBannerAudience;
    dismissible: boolean;
    actionLabel: string | null;
    actionUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ActiveSiteBannerQuery {
    activeSiteBanner: SiteBanner | null;
}

export interface SiteBannersQuery {
    siteBanners: SiteBanner[];
}
