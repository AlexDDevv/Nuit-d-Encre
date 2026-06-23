import type {
    BannerVariant,
    BannerVariantConfig,
} from "@/components/UI/Banner/Banner.types";

const GOLD = "hsl(43 59% 81%)";
const GOLD_FG = "hsl(43 59% 21%)";

export const baseClasses =
    "relative flex flex-col gap-4 overflow-hidden rounded-xl border-2 px-5 py-4 sm:flex-row sm:items-center";

/**
 * Configuration sémantique par variante. La couleur colore bordure / icône /
 * accent - jamais le fond, qui reste une surface sombre légèrement teintée.
 */
export const variantConfig: Record<BannerVariant, BannerVariantConfig> = {
    info: {
        icon: "info",
        role: "status",
        accent: "hsl(205 30% 64%)",
        onAccent: "hsl(205 35% 12%)",
        border: "hsl(205 28% 56% / 0.42)",
        tint: "hsl(205 24% 17% / 0.5)",
        iconBg: "hsl(205 28% 52% / 0.15)",
    },
    success: {
        icon: "checkCircle",
        role: "status",
        accent: "hsl(140 40% 58%)",
        onAccent: "hsl(140 40% 10%)",
        border: "hsl(140 36% 46% / 0.5)",
        tint: "hsl(140 30% 15% / 0.55)",
        iconBg: "hsl(140 33% 40% / 0.18)",
    },
    warning: {
        icon: "alertTriangle",
        role: "status",
        accent: "hsl(25 82% 62%)",
        onAccent: "hsl(25 60% 10%)",
        border: "hsl(25 78% 52% / 0.5)",
        tint: "hsl(25 45% 16% / 0.5)",
        iconBg: "hsl(25 78% 51% / 0.16)",
    },
    error: {
        icon: "alertOctagon",
        role: "alert",
        accent: "hsl(3 84% 64%)",
        onAccent: "hsl(3 60% 10%)",
        border: "hsl(3 84% 54% / 0.5)",
        tint: "hsl(3 45% 16% / 0.5)",
        iconBg: "hsl(3 84% 51% / 0.16)",
    },
    completion: {
        icon: "sparkles",
        role: "status",
        gold: true,
        accent: GOLD,
        onAccent: GOLD_FG,
        border: "hsl(43 59% 72% / 0.6)",
        tint: "hsl(43 30% 22% / 0.55)",
        iconBg: "hsl(43 59% 81% / 0.14)",
    },
};

export { GOLD, GOLD_FG };
