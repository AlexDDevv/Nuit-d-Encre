import type { ComponentType } from "react";
import type {
    LoaderConcept,
    LoaderConceptMeta,
    LoaderGlyphProps,
} from "@/types";
import Chandelle from "./Chandelle";
import Medaillon from "./Medaillon";
import PlumeEncre from "./PlumeEncre";
import Livre from "./Livre";

interface LoaderConceptEntry extends LoaderConceptMeta {
    /** Composant glyphe animé. */
    Comp: ComponentType<LoaderGlyphProps>;
    /** Taille de référence en pleine zone (fallback de page). */
    bigSize: number;
}

/**
 * Registre des quatre concepts « Le battement nocturne ». La phrase `line`
 * s'affiche en serif sous l'animation lorsqu'un libellé est demandé.
 */
export const LOADER_CONCEPTS: Record<LoaderConcept, LoaderConceptEntry> = {
    chandelle: {
        id: "chandelle",
        name: "Chandelle",
        tag: "I",
        line: "Un instant, la chandelle s’allume…",
        Comp: Chandelle,
        bigSize: 210,
    },
    medaillon: {
        id: "medaillon",
        name: "Médaillon lunaire",
        tag: "II",
        line: "Le sceau lunaire se grave…",
        Comp: Medaillon,
        bigSize: 210,
    },
    plume: {
        id: "plume",
        name: "Plume & encre",
        tag: "III",
        line: "La plume trace la première ligne…",
        Comp: PlumeEncre,
        bigSize: 300,
    },
    livre: {
        id: "livre",
        name: "Livre revisité",
        tag: "IV",
        line: "On feuillette les rayons…",
        Comp: Livre,
        bigSize: 260,
    },
};
