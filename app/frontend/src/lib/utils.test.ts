import { describe, expect, it } from "vitest";
import { Author, Book } from "@/types/types";
import {
    buildAuthorAriaLabel,
    buildBookAriaLabel,
    getRatingClasses,
    hasIncompleteBookInfo,
    hasIncompleteInfo,
    slugify,
} from "./utils";

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

describe("hasIncompleteBookInfo vs backend", () => {
    // Le badge « fiche à compléter » (front) et l'XP de complétion (backend,
    // isImportedBookIncomplete) doivent rester cohérents. Divergence connue :
    // le front exige en plus une couverture, le backend l'ignore. Un livre
    // importé sans couverture mais complet par ailleurs n'affiche donc plus de
    // badge une fois les autres champs remplis, alors que l'XP est déjà
    // accordée. Si le backend ajoute coverUrl à sa règle, supprimer ce test.
    it("est plus strict que le backend sur la couverture", () => {
        const sansCouverture = {
            isImported: true,
            summary: "Un vrai résumé.",
            pageCount: 96,
            category: { name: "Roman" },
            coverUrl: undefined,
        } as Book;

        expect(hasIncompleteBookInfo(sansCouverture)).toBe(true);
    });
});

describe("hasIncompleteInfo", () => {
    const auteurComplet = {
        firstname: "Albert",
        lastname: "Camus",
        birthDate: "1913-11-07",
        nationality: "fr",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Albert_Camus",
        biography: "Écrivain et philosophe français.",
    } as Author;

    it("accepte un auteur dont les quatre champs d'enrichissement sont remplis", () => {
        expect(hasIncompleteInfo(auteurComplet)).toBe(false);
    });

    it.each(["birthDate", "nationality", "wikipediaUrl", "biography"] as const)(
        "signale un auteur sans %s",
        (field) => {
            expect(
                hasIncompleteInfo({
                    ...auteurComplet,
                    [field]: undefined,
                } as Author),
            ).toBe(true);
            expect(
                hasIncompleteInfo({ ...auteurComplet, [field]: "" } as Author),
            ).toBe(true);
        },
    );

    it("ne tient pas compte des champs facultatifs", () => {
        // officialWebsite et books ne comptent pas dans la complétion.
        expect(
            hasIncompleteInfo({
                ...auteurComplet,
                officialWebsite: undefined,
            } as Author),
        ).toBe(false);
    });
});

describe("getRatingClasses", () => {
    it.each([5, 4])("colore une note de %i en doré (primary)", (rating) => {
        expect(getRatingClasses(rating)).toContain("border-l-primary");
    });

    it("colore une note de 3 en teinte neutre", () => {
        expect(getRatingClasses(3)).toContain("border-l-accent-foreground");
    });

    it.each([2, 1, 0])(
        "colore une note de %i en rouge (destructive)",
        (rating) => {
            expect(getRatingClasses(rating)).toContain("border-l-destructive");
        },
    );
});

describe("libellés d'accessibilité", () => {
    it("décrit un livre avec son auteur et sa catégorie", () => {
        expect(
            buildBookAriaLabel(
                "L'Étranger",
                { firstname: "Albert", lastname: "Camus" },
                "Roman",
            ),
        ).toBe("Voir le livre L'Étranger par Albert Camus - Roman");
    });

    it("retombe sur la catégorie « Livre » par défaut", () => {
        expect(
            buildBookAriaLabel("L'Étranger", {
                firstname: "Albert",
                lastname: "Camus",
            }),
        ).toContain("- Livre");
    });

    it("omet la mention « par » quand l'auteur n'a pas de nom", () => {
        expect(
            buildBookAriaLabel("Le Roman de Renart", {
                firstname: "",
                lastname: "",
            }),
        ).toBe("Voir le livre Le Roman de Renart - Livre");
    });

    it("n'insère pas d'espace en trop avec un auteur partiel", () => {
        expect(
            buildBookAriaLabel("Le Misanthrope", {
                firstname: "",
                lastname: "Molière",
            }),
        ).toBe("Voir le livre Le Misanthrope par Molière - Livre");
        expect(buildAuthorAriaLabel("", "Molière")).toBe(
            "Voir la fiche de l'auteur Molière",
        );
    });
});
