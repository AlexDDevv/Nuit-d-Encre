const SOURCE_LABELS: Record<string, { label: string; short: string }> = {
    open_library: { label: "Open Library", short: "OPEN LIBRARY" },
    google_books: { label: "Google Books", short: "GOOGLE BOOKS" },
};

const LANG_LABELS: Record<string, string> = {
    fr: "Français",
    en: "Anglais",
    es: "Espagnol",
    de: "Allemand",
    it: "Italien",
    pt: "Portugais",
    nl: "Néerlandais",
    ru: "Russe",
    ja: "Japonais",
    zh: "Chinois",
    ar: "Arabe",
};

export const sourceInfo = (source?: string) =>
    (source && SOURCE_LABELS[source]) || { label: "Source externe", short: "EXTERNE" };

export const langLabel = (lang?: string) =>
    lang ? (LANG_LABELS[lang.toLowerCase()] ?? lang.toUpperCase()) : null;
