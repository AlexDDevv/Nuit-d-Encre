import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserAction, UserActionType } from "@/types/types";
import {
    computeStats,
    describeAction,
    describeFeedEntry,
    formatRelativeDate,
    sortByRecent,
    timeBucket,
} from "./profileActivity";

const NOW = new Date("2026-06-15T12:00:00.000Z");
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Date ISO située `ms` millisecondes avant l'horloge figée des tests. */
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

const action = (
    type: UserActionType,
    metadata: string | null = null,
    createdAt = ago(0),
): UserAction => ({ type, xp: 0, createdAt, metadata });

describe("computeStats", () => {
    it("part de zéro sans action", () => {
        expect(computeStats([])).toEqual({
            added: 0,
            finished: 0,
            reviews: 0,
            authors: 0,
            recommendations: 0,
        });
    });

    it("compte une action par compteur du profil", () => {
        expect(
            computeStats([
                action("BOOK_ADDED"),
                action("BOOK_ADDED"),
                action("BOOK_FINISHED"),
                action("REVIEW_CREATED"),
                action("AUTHOR_ADDED"),
                action("BOOK_RECOMMENDED"),
            ]),
        ).toEqual({
            added: 2,
            finished: 1,
            reviews: 1,
            authors: 1,
            recommendations: 1,
        });
    });

    it.each<UserActionType>([
        "BOOK_ADDED_TO_LIBRARY",
        "DETAILED_REVIEW_BONUS",
        "REVIEW_VOTED_HELPFUL",
        "BOOK_IMPORTED",
        "BOOK_COMPLETED",
        "AUTHOR_COMPLETED",
    ])("ignore %s, qui n'alimente aucun compteur affiché", (type) => {
        expect(computeStats([action(type)])).toEqual(computeStats([]));
    });
});

describe("describeAction", () => {
    it.each<[UserActionType, string, string]>([
        ["BOOK_ADDED", "A ajouté « Dune »", "added"],
        [
            "BOOK_ADDED_TO_LIBRARY",
            "A ajouté « Dune » à sa bibliothèque",
            "added",
        ],
        ["BOOK_IMPORTED", "A importé « Dune »", "added"],
        ["BOOK_FINISHED", "A terminé « Dune »", "finished"],
        ["BOOK_COMPLETED", "A complété la fiche de « Dune »", "complete"],
        ["REVIEW_CREATED", "A écrit une critique de « Dune »", "review"],
        ["BOOK_RECOMMENDED", "A recommandé « Dune »", "reco"],
    ])("décrit %s", (type, label, kind) => {
        expect(describeAction(action(type, '{"title":"Dune"}'))).toEqual({
            label,
            kind,
        });
    });

    it.each<[UserActionType, string, string]>([
        ["AUTHOR_ADDED", "A ajouté l'auteur Frank Herbert", "author"],
        [
            "AUTHOR_COMPLETED",
            "A complété la fiche de Frank Herbert",
            "complete",
        ],
    ])("décrit %s avec le nom complet de l'auteur", (type, label, kind) => {
        expect(
            describeAction(
                action(type, '{"firstname":"Frank","lastname":"Herbert"}'),
            ),
        ).toEqual({ label, kind });
    });

    it.each<[UserActionType, string, string]>([
        ["DETAILED_REVIEW_BONUS", "A rédigé une critique détaillée", "review"],
        ["REVIEW_VOTED_HELPFUL", "A jugé une critique utile", "reco"],
    ])("décrit %s sans dépendre des métadonnées", (type, label, kind) => {
        expect(describeAction(action(type))).toEqual({ label, kind });
    });

    it("remplace un titre manquant par une tournure générique", () => {
        expect(describeAction(action("BOOK_ADDED")).label).toBe(
            "A ajouté un ouvrage",
        );
        expect(describeAction(action("BOOK_ADDED", "{}")).label).toBe(
            "A ajouté un ouvrage",
        );
    });

    it("remplace un auteur incomplet par une tournure générique", () => {
        expect(describeAction(action("AUTHOR_ADDED", "{}")).label).toBe(
            "A ajouté l'auteur un auteur",
        );
        expect(
            describeAction(action("AUTHOR_ADDED", '{"lastname":"Herbert"}'))
                .label,
        ).toBe("A ajouté l'auteur Herbert");
    });

    it.each([
        ["illisibles", "{pas du json"],
        ["non objet", '"Dune"'],
        ["nulles", null],
    ])("survit à des métadonnées %s", (_label, metadata) => {
        expect(describeAction(action("BOOK_ADDED", metadata)).label).toBe(
            "A ajouté un ouvrage",
        );
    });

    it("retombe sur un libellé neutre pour un type inconnu du front", () => {
        // Un nouveau UserActionType ajouté côté backend ne doit pas casser le
        // journal : il s'affiche en « a gagné de l'expérience ».
        expect(
            describeAction(action("BOOK_UNSHELVED" as UserActionType)),
        ).toEqual({ label: "A gagné de l'expérience", kind: "added" });
    });
});

describe("describeFeedEntry", () => {
    it("produit exactement le même texte que le journal de profil", () => {
        const metadata = '{"title":"Dune"}';
        expect(describeFeedEntry({ type: "BOOK_ADDED", metadata })).toEqual(
            describeAction(action("BOOK_ADDED", metadata)),
        );
    });
});

describe("dates", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("timeBucket", () => {
        it.each([
            ["à l'instant", 0, "today", "Aujourd'hui"],
            ["il y a 23 h", 23 * HOUR_MS, "today", "Aujourd'hui"],
            ["il y a 25 h", DAY_MS + HOUR_MS, "yesterday", "Hier"],
            ["il y a 3 jours", 3 * DAY_MS, "week", "Cette semaine"],
            ["il y a 8 jours", 8 * DAY_MS, "earlier", "Plus tôt"],
        ])("range %s dans %s", (_label, age, key, label) => {
            expect(timeBucket(ago(age))).toEqual({ key, label });
        });

        it.each([
            ["24 h pile bascule sur Hier", DAY_MS, "yesterday"],
            ["48 h pile bascule sur Cette semaine", 2 * DAY_MS, "week"],
            ["7 jours pile bascule sur Plus tôt", 7 * DAY_MS, "earlier"],
        ])("%s", (_label, age, key) => {
            expect(timeBucket(ago(age)).key).toBe(key);
        });
    });

    describe("formatRelativeDate", () => {
        it.each([
            ["30 secondes", 30 * 1000, "il y a 30 secondes"],
            ["5 minutes", 5 * 60 * 1000, "il y a 5 minutes"],
            ["3 heures", 3 * HOUR_MS, "il y a 3 heures"],
            ["hier", DAY_MS, "hier"],
            ["2 jours", 2 * DAY_MS, "avant-hier"],
            ["3 semaines", 21 * DAY_MS, "il y a 3 semaines"],
            // 365 jours retombe sur « 12 mois » : les divisions cumulées
            // (7 jours, 4,34524 semaines, 12 mois) n'atteignent pas tout à
            // fait l'année.
            ["1 an", 365 * DAY_MS, "il y a 12 mois"],
            ["2 ans", 730 * DAY_MS, "il y a 2 ans"],
        ])("formate %s en français", (_label, age, expected) => {
            expect(formatRelativeDate(ago(age))).toBe(expected);
        });

        it("renvoie une chaîne vide pour une date invalide", () => {
            expect(formatRelativeDate("pas une date")).toBe("");
            expect(formatRelativeDate("")).toBe("");
        });
    });
});

describe("sortByRecent", () => {
    it("classe de la plus récente à la plus ancienne", () => {
        const recent = action("BOOK_ADDED", null, "2026-06-15T10:00:00.000Z");
        const older = action("BOOK_ADDED", null, "2026-06-01T10:00:00.000Z");
        const oldest = action("BOOK_ADDED", null, "2025-12-31T10:00:00.000Z");

        expect(sortByRecent([older, oldest, recent])).toEqual([
            recent,
            older,
            oldest,
        ]);
    });

    it("ne modifie pas le tableau reçu", () => {
        const input = [
            action("BOOK_ADDED", null, "2026-06-01T10:00:00.000Z"),
            action("BOOK_ADDED", null, "2026-06-15T10:00:00.000Z"),
        ];
        const snapshot = [...input];

        sortByRecent(input);

        expect(input).toEqual(snapshot);
    });
});
