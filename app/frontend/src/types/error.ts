/** Motif d'illustration littéraire associé à chaque type d'erreur. */
export type ErrorMotif =
    | "emptyShelf"
    | "candle"
    | "brokenSeal"
    | "lockedTome"
    | "bookmark"
    | "inkwell";

/** Contenu éditorial d'une page d'erreur (catalogue « Nuit d'Encre »). */
export interface ErrorContent {
    /** Code HTTP affiché en grand chiffre embossé. Vide pour le cas générique. */
    code: string;
    label: string;
    motif: ErrorMotif;
    /** Référence de catalogue affichée en suréclat (eyebrow). */
    ref: string;
    message: string;
    /** Indication complémentaire optionnelle (ex. 401). */
    hint?: string;
    /** Libellé d'accessibilité du bloc d'alerte. */
    aria: string;
}

/** Détails techniques réels d'une erreur, affichés en mode développement. */
export interface ErrorTechDetails {
    type: string;
    status?: string;
    message?: string;
    data?: string;
    stack?: string;
}
