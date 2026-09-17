import { Author } from "../../../database/entities/author/author";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { Roles, UserActionType } from "../../../types/types";
import { AuthorsResolver } from "./author-resolver";

jest.mock("../../../services/grind/grant-xp-service");

const grantXp = grantXpService as jest.Mock;

const owner = makeUser("owner");
const stranger = makeUser("stranger");
const admin = makeUser("admin", Roles.Admin);

function makeAuthor(overrides: Partial<Author> = {}): Author {
    return Object.assign(new Author(), {
        id: "author-1",
        firstname: "Albert",
        lastname: "Camus",
        user: owner,
        ...overrides,
    });
}

describe("AuthorsResolver", () => {
    const resolver = new AuthorsResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(Author);
    });

    describe("updateAuthor", () => {
        it("limite la recherche aux auteurs de l'utilisateur quand il n'est pas admin", async () => {
            const findOne = jest.spyOn(Author, "findOne").mockResolvedValue(null);

            await expect(
                resolver.updateAuthor({ id: "author-1" }, makeContext(stranger))
            ).rejects.toMatchObject({ statusCode: 404 });
            expect(findOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: "author-1", user: { id: "stranger" } },
                })
            );
        });

        it("permet à un admin de modifier l'auteur d'un autre utilisateur", async () => {
            const findOne = jest
                .spyOn(Author, "findOne")
                .mockResolvedValue(makeAuthor());

            const updated = await resolver.updateAuthor(
                { id: "author-1", nationality: "FR" },
                makeContext(admin)
            );

            expect(findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "author-1" } })
            );
            expect(updated?.nationality).toBe("FR");
        });

        it("récompense la complétion de la fiche avec une clé liée à l'auteur", async () => {
            jest.spyOn(Author, "findOne").mockResolvedValue(makeAuthor());

            await resolver.updateAuthor(
                {
                    id: "author-1",
                    birthDate: "1913-11-07",
                    nationality: "FR",
                    wikipediaUrl: "https://fr.wikipedia.org/wiki/Albert_Camus",
                    biography: "Écrivain et philosophe.",
                },
                makeContext(owner)
            );

            expect(grantXp).toHaveBeenCalledWith(
                owner,
                UserActionType.AUTHOR_COMPLETED,
                expect.objectContaining({ xpKey: "author:author-1" })
            );
        });
    });

    describe("deleteAuthor", () => {
        it("refuse la suppression par un utilisateur qui n'est pas le propriétaire", async () => {
            jest.spyOn(Author, "findOne").mockResolvedValue(makeAuthor());

            await expect(
                resolver.deleteAuthor("author-1", makeContext(stranger))
            ).rejects.toMatchObject({ statusCode: 403 });
            expect(Author.prototype.remove).not.toHaveBeenCalled();
        });
    });
});
