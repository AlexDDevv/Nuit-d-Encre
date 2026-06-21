import { registerEnumType } from "type-graphql";

/** Variante sémantique d'une bannière de site (hors `completion`, réservée à la gamification). */
export enum BannerVariant {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
}

/** Audience cible d'une bannière de site : tout le monde ou connectés uniquement. */
export enum BannerAudience {
    ALL = "ALL",
    AUTHENTICATED = "AUTHENTICATED",
}

registerEnumType(BannerVariant, { name: "BannerVariant" });
registerEnumType(BannerAudience, { name: "BannerAudience" });
