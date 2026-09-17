import { Book } from "../../../database/entities/book/book";
import { Category } from "../../../database/entities/category/category";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { Roles, UserActionType } from "../../../types/types";
import { BooksResolver } from "./book-resolver";

jest.mock("../../../database/config/datasource", () => ({
    dataSource: { transaction: jest.fn() },
}));
jest.mock("../../../services/grind/grant-xp-service");

const grantXp = grantXpService as jest.Mock;

const owner = makeUser("owner");
const stranger = makeUser("stranger");
const admin = makeUser("admin", Roles.Admin);

function makeBook(overrides: Partial<Book> = {}): Book {
    const category = new Category();
    category.name = "Roman";
    return Object.assign(new Book(), {
        id: "book-1",
        title: "Le Petit Prince",
        summary: "Un aviateur rencontre un petit prince.",
        pageCount: 96,
        isImported: false,
        user: owner,
        category,
        ...overrides,
    });
}

describe("BooksResolver", () => {
    const resolver = new BooksResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(Book);
    });

    describe("updateBook", () => {
        it("limite la recherche aux livres de l'utilisateur quand il n'est pas admin", async () => {
            const findOne = jest.spyOn(Book, "findOne").mockResolvedValue(null);

            await expect(
                resolver.updateBook({ id: "book-1" }, makeContext(stranger))
            ).rejects.toMatchObject({ statusCode: 404 });
            expect(findOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: "book-1", user: { id: "stranger" } },
                })
            );
        });

        it("permet à un admin de modifier le livre d'un autre utilisateur", async () => {
            const findOne = jest
                .spyOn(Book, "findOne")
                .mockResolvedValue(makeBook());

            const updated = await resolver.updateBook(
                { id: "book-1", title: "Nouveau titre" },
                makeContext(admin)
            );

            expect(findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "book-1" } })
            );
            expect(updated?.title).toBe("Nouveau titre");
        });

        it("récompense la complétion d'un livre importé avec une clé liée au livre", async () => {
            jest.spyOn(Book, "findOne").mockResolvedValue(
                makeBook({ isImported: true, pageCount: 0 })
            );

            await resolver.updateBook(
                { id: "book-1", pageCount: 120 },
                makeContext(owner)
            );

            expect(grantXp).toHaveBeenCalledWith(
                owner,
                UserActionType.BOOK_COMPLETED,
                expect.objectContaining({ xpKey: "book:book-1" })
            );
        });

        it("ne récompense rien si le livre reste incomplet", async () => {
            jest.spyOn(Book, "findOne").mockResolvedValue(
                makeBook({ isImported: true, pageCount: 0 })
            );

            await resolver.updateBook(
                { id: "book-1", title: "Autre titre" },
                makeContext(owner)
            );

            expect(grantXp).not.toHaveBeenCalled();
        });
    });

    describe("deleteBook", () => {
        it("refuse la suppression par un utilisateur qui n'est pas le propriétaire", async () => {
            jest.spyOn(Book, "findOne").mockResolvedValue(makeBook());

            await expect(
                resolver.deleteBook("book-1", makeContext(stranger))
            ).rejects.toMatchObject({ statusCode: 403 });
            expect(Book.prototype.remove).not.toHaveBeenCalled();
        });

        it.each([
            ["le propriétaire", owner],
            ["un admin", admin],
        ])("autorise la suppression par %s", async (_label, user) => {
            jest.spyOn(Book, "findOne").mockResolvedValue(makeBook());

            await resolver.deleteBook("book-1", makeContext(user));

            expect(Book.prototype.remove).toHaveBeenCalledTimes(1);
        });
    });
});
