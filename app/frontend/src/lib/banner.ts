import type {
    BannerDraft,
    BannerEditorVariant,
    SiteBannerVariant,
} from "@/types/types";

/** Variante GraphQL (majuscules) → variante du composant Banner (minuscules). */
export const toBannerVariant = (v: SiteBannerVariant): BannerEditorVariant =>
    v.toLowerCase() as BannerEditorVariant;

/** Variante de l'éditeur (minuscules) → variante GraphQL (majuscules). */
export const toSiteBannerVariant = (
    v: BannerEditorVariant,
): SiteBannerVariant => v.toUpperCase() as SiteBannerVariant;

/** Brouillon vierge de l'éditeur de bannière. */
export const blankDraft = (): BannerDraft => ({
    variant: "info",
    title: "",
    content: "",
    audience: "ALL",
    hasAction: false,
    actionLabel: "",
    actionTarget: "",
    dismissible: true,
});
