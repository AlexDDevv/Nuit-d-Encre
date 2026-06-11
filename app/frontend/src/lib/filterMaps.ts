import { BookFormat, UserBookStatus } from "@/types/types";

export const formatLabelMap: Record<BookFormat, string> = {
    hardcover: "Livre relié",
    paperback: "Livre broché",
    softcover: "Livre de poche",
    pocket: "Livre de poche",
};

/** Libellés de format compacts, pour les métadonnées denses des cartes. */
export const formatShortLabelMap: Record<BookFormat, string> = {
    hardcover: "Relié",
    paperback: "Broché",
    softcover: "Poche",
    pocket: "Poche",
};

export const languageLabelMap: Record<string, string> = {
    fr: "Français",
    en: "Anglais",
    es: "Espagnol",
    de: "Allemand",
    it: "Italien",
};

export const languageLabelToCode = Object.fromEntries(
    Object.entries(languageLabelMap).map(([code, label]) => [label, code]),
);

export const statusLabelMap: Record<UserBookStatus, string> = {
    TO_READ: "À lire",
    READING: "En cours",
    READ: "Lu",
    PAUSED: "En pause",
};

/**
 * Décode un code de nationalité (ISO 2 lettres, ex. « fr ») en libellé pays
 * affichable sur les cartes auteur. Repli : le code en majuscules.
 */
export const countryLabelMap: Record<string, string> = {
    fr: "France",
    en: "Royaume-Uni",
    us: "États-Unis",
    es: "Espagne",
    de: "Allemagne",
    it: "Italie",
    pt: "Portugal",
    br: "Brésil",
    ru: "Russie",
    jp: "Japon",
    cn: "Chine",
    be: "Belgique",
    ch: "Suisse",
    ca: "Canada",
    ie: "Irlande",
    nl: "Pays-Bas",
    se: "Suède",
    no: "Norvège",
    dk: "Danemark",
    gr: "Grèce",
    pl: "Pologne",
    at: "Autriche",
    ar: "Argentine",
    co: "Colombie",
    mx: "Mexique",
    cl: "Chili",
};

/**
 * Renvoie le libellé pays pour un code de nationalité, ou le code en majuscules
 * si inconnu (chaîne vide si non renseigné).
 */
export function getCountryLabel(nationality?: string): string {
    if (!nationality) return "";
    return (
        countryLabelMap[nationality.toLowerCase()] ??
        nationality.toUpperCase()
    );
}
