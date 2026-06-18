import type { SiteBannerVariant } from "@/types/types";

/** Variante éditable d'une bannière (minuscules, contrat du composant Banner). */
export type EditorBannerVariant = "info" | "success" | "warning" | "error";

/** Variante GraphQL (majuscules) → variante du composant Banner (minuscules). */
export const toBannerVariant = (v: SiteBannerVariant): EditorBannerVariant =>
    v.toLowerCase() as EditorBannerVariant;

/** Variante de l'éditeur (minuscules) → variante GraphQL (majuscules). */
export const toSiteBannerVariant = (
    v: EditorBannerVariant,
): SiteBannerVariant => v.toUpperCase() as SiteBannerVariant;
