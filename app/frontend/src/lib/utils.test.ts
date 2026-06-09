import { describe, expect, it } from "vitest";
import { Book } from "@/types/types";
import { hasIncompleteBookInfo, slugify } from "./utils";

describe("slugify", () => {
    it("lowercases and replaces spaces with dashes", () => {
        expect(slugify("Le Petit Prince")).toBe("le-petit-prince");
    });

    it("strips accents and special characters", () => {
        expect(slugify("Antoine de Saint-Exupéry")).toBe(
            "antoine-de-saint-exupery",
        );
        expect(slugify("L'Étranger !")).toBe("letranger");
    });

    it("collapses consecutive separators", () => {
        expect(slugify("  Voyage   au bout -- de la nuit  ")).toBe(
            "voyage-au-bout-de-la-nuit",
        );
    });
});

describe("hasIncompleteBookInfo", () => {
    const completeImportedBook = {
        isImported: true,
        summary: "Un vrai résumé.",
        pageCount: 96,
        category: { name: "Roman" },
        coverUrl: "https://example.com/cover.jpg",
    } as Book;

    it("never flags a book that was not imported", () => {
        expect(
            hasIncompleteBookInfo({
                ...completeImportedBook,
                isImported: false,
                pageCount: 0,
            } as Book),
        ).toBe(false);
    });

    it("accepts an imported book with full information", () => {
        expect(hasIncompleteBookInfo(completeImportedBook)).toBe(false);
    });

    it("flags an imported book with a missing field", () => {
        expect(
            hasIncompleteBookInfo({
                ...completeImportedBook,
                summary: "Importé depuis une source externe.",
            } as Book),
        ).toBe(true);
        expect(
            hasIncompleteBookInfo({
                ...completeImportedBook,
                pageCount: 0,
            } as Book),
        ).toBe(true);
        expect(
            hasIncompleteBookInfo({
                ...completeImportedBook,
                category: { name: "Autre" },
            } as Book),
        ).toBe(true);
        expect(
            hasIncompleteBookInfo({
                ...completeImportedBook,
                coverUrl: undefined,
            } as Book),
        ).toBe(true);
    });
});
