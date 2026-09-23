import { describe, expect, it } from "vitest";
import { FeedEntry, UserActionType } from "@/types/types";
import { feedTarget } from "./feedTargetHref";

const entry = (
    type: UserActionType,
    metadata: string | null,
    targetId: string | null = "0f2b1c8e-5f3a-4a1d-9c7e-2b6d8a1f4e30",
): FeedEntry => ({
    id: "entry-1",
    type,
    metadata,
    targetId,
    createdAt: "2026-06-15T12:00:00.000Z",
    actor: { id: "user-1", userName: "Lecteur", avatar: null, level: 3 },
});

const ID = "0f2b1c8e-5f3a-4a1d-9c7e-2b6d8a1f4e30";

describe("feedTarget", () => {
    describe("livres", () => {
        it.each<UserActionType>([
            "BOOK_ADDED",
            "BOOK_IMPORTED",
            "BOOK_COMPLETED",
            "BOOK_RECOMMENDED",
        ])("construit le lien de fiche pour %s", (type) => {
            expect(
                feedTarget(entry(type, '{"title":"Le Petit Prince"}')),
            ).toEqual({
                kind: "book",
                label: "Le Petit Prince",
                href: `/books/${ID}-le-petit-prince`,
            });
        });

        it("slugifie le titre dans l'URL", () => {
            expect(
                feedTarget(entry("BOOK_ADDED", '{"title":"L\'Étranger !"}'))
                    ?.href,
            ).toBe(`/books/${ID}-letranger`);
        });
    });

    describe("auteurs", () => {
        it.each<UserActionType>(["AUTHOR_ADDED", "AUTHOR_COMPLETED"])(
            "construit le lien de fiche pour %s",
            (type) => {
                expect(
                    feedTarget(
                        entry(
                            type,
                            '{"firstname":"Albert","lastname":"Camus"}',
                        ),
                    ),
                ).toEqual({
                    kind: "author",
                    label: "Albert Camus",
                    href: `/authors/${ID}-albert-camus`,
                });
            },
        );

        it("accepte un auteur n'ayant qu'un nom", () => {
            expect(
                feedTarget(entry("AUTHOR_ADDED", '{"lastname":"Molière"}')),
            ).toEqual({
                kind: "author",
                label: "Molière",
                href: `/authors/${ID}-moliere`,
            });
        });

        it("n'invente pas de lien sans nom exploitable", () => {
            expect(feedTarget(entry("AUTHOR_ADDED", "{}"))).toBeNull();
        });
    });

    describe("types volontairement exclus", () => {
        // Leur targetId n'est pas l'id d'une fiche : BOOK_ADDED_TO_LIBRARY et
        // BOOK_FINISHED pointent un UserBook, REVIEW_CREATED une critique.
        // Les lier produirait un lien mort (404).
        it.each<UserActionType>([
            "BOOK_ADDED_TO_LIBRARY",
            "BOOK_FINISHED",
            "REVIEW_CREATED",
            "DETAILED_REVIEW_BONUS",
            "REVIEW_VOTED_HELPFUL",
        ])("ne produit aucun lien pour %s", (type) => {
            expect(
                feedTarget(entry(type, '{"title":"Le Petit Prince"}')),
            ).toBeNull();
        });
    });

    describe("entrées inexploitables", () => {
        it("ne produit aucun lien sans targetId", () => {
            expect(
                feedTarget(
                    entry("BOOK_ADDED", '{"title":"Le Petit Prince"}', null),
                ),
            ).toBeNull();
        });

        it("ne produit aucun lien sans titre de livre", () => {
            expect(feedTarget(entry("BOOK_ADDED", "{}"))).toBeNull();
            expect(feedTarget(entry("BOOK_ADDED", null))).toBeNull();
        });

        it.each([
            ["illisibles", "{pas du json"],
            ["non objet", '"Le Petit Prince"'],
        ])("survit à des métadonnées %s", (_label, metadata) => {
            expect(feedTarget(entry("BOOK_ADDED", metadata))).toBeNull();
        });

        it("ignore un type inconnu du front", () => {
            expect(
                feedTarget(
                    entry(
                        "BOOK_UNSHELVED" as UserActionType,
                        '{"title":"Le Petit Prince"}',
                    ),
                ),
            ).toBeNull();
        });
    });
});
