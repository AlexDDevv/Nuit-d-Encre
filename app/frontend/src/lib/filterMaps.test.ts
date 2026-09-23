import { describe, expect, it } from "vitest";
import { BOOK_STATES } from "@/constants/bookStatus";
import { BookFormat, UserBookStatus } from "@/types/types";
import {
    formatLabelMap,
    formatShortLabelMap,
    getCountryLabel,
    getSourceLabel,
    languageLabelMap,
    languageLabelToCode,
    statusLabelMap,
} from "./filterMaps";

const STATUSES: UserBookStatus[] = ["TO_READ", "READING", "READ", "PAUSED"];
const FORMATS: BookFormat[] = ["hardcover", "paperback", "softcover", "pocket"];

describe("statuts de lecture", () => {
    // Les filtres de la bibliothèque envoient des libellés que le hook
    // retraduit en valeurs d'enum : un libellé désynchronisé fait disparaître
    // le filtre sans erreur visible.
    it("libelle chaque statut de l'enum", () => {
        expect(Object.keys(statusLabelMap).sort()).toEqual(
            [...STATUSES].sort(),
        );
    });

    it("associe au plus un statut par libellé", () => {
        const labels = Object.values(statusLabelMap);
        expect(new Set(labels).size).toBe(labels.length);
    });

    it("utilise les mêmes libellés que le sélecteur de statut", () => {
        for (const state of BOOK_STATES) {
            expect(statusLabelMap[state.value]).toBe(state.label);
        }
    });

    it("propose chaque statut de l'enum dans le sélecteur", () => {
        expect(BOOK_STATES.map((s) => s.value).sort()).toEqual(
            [...STATUSES].sort(),
        );
    });
});

describe("formats", () => {
    it.each(FORMATS)(
        "libelle le format %s en version longue et courte",
        (format) => {
            expect(formatLabelMap[format]).toBeTruthy();
            expect(formatShortLabelMap[format]).toBeTruthy();
        },
    );

    it("partage volontairement un libellé entre softcover et pocket", () => {
        // Deux valeurs distinctes côté backend, un seul mot côté lecteur.
        expect(formatLabelMap.softcover).toBe(formatLabelMap.pocket);
        expect(formatShortLabelMap.softcover).toBe(formatShortLabelMap.pocket);
    });
});

describe("langues", () => {
    it("retrouve le code de chaque langue depuis son libellé", () => {
        for (const [code, label] of Object.entries(languageLabelMap)) {
            expect(languageLabelToCode[label]).toBe(code);
        }
    });

    it("n'associe pas deux langues au même libellé", () => {
        const labels = Object.values(languageLabelMap);
        expect(new Set(labels).size).toBe(labels.length);
    });

    it("ignore un libellé inconnu", () => {
        expect(languageLabelToCode["Klingon"]).toBeUndefined();
    });
});

describe("getSourceLabel", () => {
    it.each([
        ["open_library", "Open Library"],
        ["google_books", "Google Books"],
    ])("libelle la source %s", (source, label) => {
        expect(getSourceLabel(source)).toBe(label);
    });

    it("renvoie le libellé par défaut sans source", () => {
        expect(getSourceLabel()).toBe("Source externe");
        expect(getSourceLabel("")).toBe("Source externe");
    });

    it("renvoie la source telle quelle si elle est inconnue", () => {
        expect(getSourceLabel("babelio")).toBe("babelio");
    });
});

describe("getCountryLabel", () => {
    it("traduit un code de nationalité connu", () => {
        expect(getCountryLabel("fr")).toBe("France");
    });

    it("accepte un code en majuscules", () => {
        expect(getCountryLabel("FR")).toBe("France");
    });

    it("renvoie le code en majuscules si le pays est inconnu", () => {
        expect(getCountryLabel("zz")).toBe("ZZ");
    });

    it("renvoie une chaîne vide sans nationalité", () => {
        expect(getCountryLabel()).toBe("");
        expect(getCountryLabel("")).toBe("");
    });
});
