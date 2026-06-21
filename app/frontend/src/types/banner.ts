/* ── Bannière de site ──────────────────────────────────────────────────────
 * Les valeurs d'enum sont en majuscules : elles reflètent le schéma GraphQL
 * (TypeGraphQL expose les clés d'enum). Le mapping vers la variante du
 * composant Banner (minuscules) se fait via `@/lib/banner`. */

export type SiteBannerVariant = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
export type SiteBannerAudience = "ALL" | "AUTHENTICATED";

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
