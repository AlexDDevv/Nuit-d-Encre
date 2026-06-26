import { slugify } from "@/lib/utils";
import { FeedEntry } from "@/types/types";

// Uniquement les actions dont le `targetId` est bien l'id d'un livre.
// Exclus volontairement (sinon lien /books/ vers une fiche inexistante → 404) :
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

/** Lien vers la cible d'une entrée de fil (livre/auteur), ou null. */
export function feedTargetHref(entry: FeedEntry): string | null {
    if (!entry.targetId) return null;
    const m = parseMeta(entry.metadata);

    if (BOOK_TYPES.has(entry.type)) {
        const slug = m.title ? slugify(m.title) : "";
        return `/books/${entry.targetId}-${slug}`;
    }
    if (AUTHOR_TYPES.has(entry.type)) {
        const full = [m.firstname, m.lastname].filter(Boolean).join(" ");
        const slug = full ? slugify(full) : "";
        return `/authors/${entry.targetId}-${slug}`;
    }
    return null;
}
