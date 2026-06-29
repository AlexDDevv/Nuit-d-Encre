import { slugify } from "@/lib/utils";
import { FeedEntry } from "@/types/types";

// Uniquement les actions dont le `targetId` est bien l'id d'une fiche.
// Exclus volontairement (sinon lien vers une fiche inexistante → 404) :
// - BOOK_ADDED_TO_LIBRARY / BOOK_FINISHED → targetId = id du UserBook, pas du livre
// - REVIEW_CREATED → targetId = id de la critique (et metadata utilise `bookTitle`)
const BOOK_TYPES = new Set([
    "BOOK_ADDED",
    "BOOK_IMPORTED",
    "BOOK_COMPLETED",
    "BOOK_RECOMMENDED",
]);
const AUTHOR_TYPES = new Set(["AUTHOR_ADDED", "AUTHOR_COMPLETED"]);

function parseMeta(metadata: string | null): {
    title?: string;
    firstname?: string;
    lastname?: string;
} {
    if (!metadata) return {};
    try {
        const parsed = JSON.parse(metadata);
        return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
        return {};
    }
}

export interface FeedTarget {
    kind: "book" | "author";
    label: string;
    href: string;
}

/** Cible cliquable (livre/auteur) d'une entrée de fil, ou null si non exploitable. */
export function feedTarget(entry: FeedEntry): FeedTarget | null {
    if (!entry.targetId) return null;
    const m = parseMeta(entry.metadata);

    if (BOOK_TYPES.has(entry.type) && m.title) {
        return {
            kind: "book",
            label: m.title,
            href: `/books/${entry.targetId}-${slugify(m.title)}`,
        };
    }
    if (AUTHOR_TYPES.has(entry.type)) {
        const full = [m.firstname, m.lastname].filter(Boolean).join(" ");
        if (full) {
            return {
                kind: "author",
                label: full,
                href: `/authors/${entry.targetId}-${slugify(full)}`,
            };
        }
    }
    return null;
}
