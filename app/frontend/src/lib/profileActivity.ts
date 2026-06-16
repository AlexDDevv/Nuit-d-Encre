import { UserAction, UserActionType } from "@/types/types";

/**
 * Catégorie visuelle d'une action — détermine l'icône affichée dans le
 * journal d'activité (le composant mappe `kind` vers une icône react-icons).
 */
export type ActivityKind =
    | "added"
    | "finished"
    | "review"
    | "author"
    | "reco"
    | "complete";

export type ProfileStats = {
    added: number;
    finished: number;
    reviews: number;
    authors: number;
    recommendations: number;
};

type ActionMeta = {
    title?: string;
    firstname?: string;
    lastname?: string;
};

const parseMeta = (metadata: string | null): ActionMeta => {
    if (!metadata) return {};
    try {
        const parsed = JSON.parse(metadata);
        return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
        return {};
    }
};

const bookTitle = (m: ActionMeta) =>
    m.title ? `« ${m.title} »` : "un ouvrage";

const authorName = (m: ActionMeta) => {
    const full = [m.firstname, m.lastname].filter(Boolean).join(" ").trim();
    return full || "un auteur";
};

/** Libellé + catégorie d'une action, pour le journal d'activité. */
export function describeAction(action: UserAction): {
    label: string;
    kind: ActivityKind;
} {
    const m = parseMeta(action.metadata);
    switch (action.type) {
        case "BOOK_ADDED":
            return { label: `A ajouté ${bookTitle(m)}`, kind: "added" };
        case "BOOK_ADDED_TO_LIBRARY":
            return {
                label: `A ajouté ${bookTitle(m)} à sa bibliothèque`,
                kind: "added",
            };
        case "BOOK_IMPORTED":
            return { label: `A importé ${bookTitle(m)}`, kind: "added" };
        case "BOOK_FINISHED":
            return { label: `A terminé ${bookTitle(m)}`, kind: "finished" };
        case "BOOK_COMPLETED":
            return {
                label: `A complété la fiche de ${bookTitle(m)}`,
                kind: "complete",
            };
        case "REVIEW_CREATED":
            return {
                label: `A écrit une critique de ${bookTitle(m)}`,
                kind: "review",
            };
        case "DETAILED_REVIEW_BONUS":
            return {
                label: "A rédigé une critique détaillée",
                kind: "review",
            };
        case "REVIEW_VOTED_HELPFUL":
            return { label: "A jugé une critique utile", kind: "reco" };
        case "BOOK_RECOMMENDED":
            return { label: `A recommandé ${bookTitle(m)}`, kind: "reco" };
        case "AUTHOR_ADDED":
            return {
                label: `A ajouté l'auteur ${authorName(m)}`,
                kind: "author",
            };
        case "AUTHOR_COMPLETED":
            return {
                label: `A complété la fiche de ${authorName(m)}`,
                kind: "complete",
            };
        default:
            return { label: "A gagné de l'expérience", kind: "added" };
    }
}

const COUNTERS: Partial<Record<UserActionType, keyof ProfileStats>> = {
    BOOK_ADDED: "added",
    BOOK_FINISHED: "finished",
    REVIEW_CREATED: "reviews",
    AUTHOR_ADDED: "authors",
    BOOK_RECOMMENDED: "recommendations",
};

/** Agrège les statistiques affichées à partir du journal d'actions. */
export function computeStats(actions: UserAction[]): ProfileStats {
    const stats: ProfileStats = {
        added: 0,
        finished: 0,
        reviews: 0,
        authors: 0,
        recommendations: 0,
    };
    for (const action of actions) {
        const key = COUNTERS[action.type];
        if (key) stats[key] += 1;
    }
    return stats;
}

const DIVISIONS: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
];

const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

/** « il y a 2 jours », « il y a 1 semaine »… à partir d'une date ISO. */
export function formatRelativeDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    let duration = (date.getTime() - Date.now()) / 1000;
    for (const [amount, unit] of DIVISIONS) {
        if (Math.abs(duration) < amount) {
            return rtf.format(Math.round(duration), unit);
        }
        duration /= amount;
    }
    return "";
}

/** Trie les actions de la plus récente à la plus ancienne. */
export function sortByRecent(actions: UserAction[]): UserAction[] {
    return [...actions].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
