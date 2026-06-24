/* ── Loaders « Le battement nocturne » ─────────────────────────────────────
 * Quatre concepts d'animation de chargement dessinés sur mesure (SVG / CSS),
 * tous dorés sur fond sombre. Le wrapper `NocturneLoader` choisit le concept
 * via `concept` et sert de fallback de Suspense en pleine zone ou en inline.
 * Animations en transform/opacity uniquement, prefers-reduced-motion respecté. */

export type LoaderConcept = "chandelle" | "medaillon" | "plume" | "livre";

/** Props communes aux quatre glyphes animés (rendu SVG/CSS seul, sans cadre). */
export interface LoaderGlyphProps {
    /** Largeur de référence en px (la hauteur suit le ratio du concept). */
    size?: number;
    className?: string;
}

/** Props du wrapper applicatif (cadre + libellé serif + point de pulsation). */
export interface NocturneLoaderProps {
    /** Concept à afficher. Par défaut « chandelle ». */
    concept?: LoaderConcept;
    /** Largeur du glyphe. Par défaut la taille « big » du concept. */
    size?: number;
    /**
     * Libellé serif sous l'animation :
     * - `false` (défaut) : pas de libellé, un point de pulsation à la place ;
     * - `true` : libellé par défaut du concept ;
     * - chaîne : libellé personnalisé.
     */
    label?: boolean | string;
    /** Affiche le point de pulsation doré (ignoré si un libellé est présent). */
    showDot?: boolean;
    /** Variante compacte (petites zones inline) : libellé réduit, sans filet. */
    dense?: boolean;
    /** Centre le loader en pleine zone (min-h 70vh) — fallback de page. */
    fullscreen?: boolean;
    className?: string;
}

/** Métadonnées d'un concept (libellé d'attente, nom, repère). */
export interface LoaderConceptMeta {
    id: LoaderConcept;
    name: string;
    /** Repère romain (I, II, III, IV). */
    tag: string;
    /** Phrase serif affichée pendant l'attente. */
    line: string;
}
