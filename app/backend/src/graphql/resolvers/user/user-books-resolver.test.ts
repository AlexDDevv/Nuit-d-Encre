import { Book } from "../../../database/entities/book/book";
import { UserBook } from "../../../database/entities/user/user-book";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { ReadingStatus, UserActionType } from "../../../types/types";
import { UserBooksResolver } from "./user-books-resolver";

jest.mock("../../../services/grind/grant-xp-service");

const grantXp = grantXpService as jest.Mock;

function makeBook(id: string): Book {
    const book = new Book();
    book.id = id;
    book.title = "Le Petit Prince";
    return book;
}

describe("UserBooksResolver", () => {
    const resolver = new UserBooksResolver();
    const user = makeUser("user-1");

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(UserBook);
    });

    describe("createUserBook", () => {
        it("refuse un livre déjà présent dans la bibliothèque", async () => {
            jest.spyOn(Book, "findOne").mockResolvedValue(makeBook("book-1"));
            jest.spyOn(UserBook, "findOne").mockResolvedValue(new UserBook());

            await expect(
                resolver.createUserBook({ bookId: "book-1" }, makeContext(user))
            ).rejects.toMatchObject({ statusCode: 409 });
            expect(grantXp).not.toHaveBeenCalled();
        });

        it("récompense l'ajout avec une clé liée au livre, pas à l'entrée de bibliothèque", async () => {
            jest.spyOn(Book, "findOne").mockResolvedValue(makeBook("book-1"));
            jest.spyOn(UserBook, "findOne")
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(new UserBook());

            await resolver.createUserBook(
                { bookId: "book-1", status: ReadingStatus.TO_READ },
                makeContext(user)
            );

            expect(grantXp).toHaveBeenCalledTimes(1);
            expect(grantXp).toHaveBeenCalledWith(
                user,
                UserActionType.BOOK_ADDED_TO_LIBRARY,
                expect.objectContaining({ xpKey: "book:book-1" })
            );
        });

        it("récompense aussi la lecture terminée quand le livre est ajouté comme lu", async () => {
            jest.spyOn(Book, "findOne").mockResolvedValue(makeBook("book-1"));
            jest.spyOn(UserBook, "findOne")
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(new UserBook());

            await resolver.createUserBook(
                { bookId: "book-1", status: ReadingStatus.READ },
                makeContext(user)
            );

            expect(grantXp).toHaveBeenCalledWith(
                user,
                UserActionType.BOOK_FINISHED,
                expect.objectContaining({ xpKey: "book:book-1" })
            );
        });
    });

    describe("updateUserBook", () => {
        function existingUserBook(status: ReadingStatus): UserBook {
            const userBook = new UserBook();
            userBook.id = "ub-1";
            userBook.status = status;
            userBook.user = user;
            userBook.book = makeBook("book-1");
            return userBook;
        }

        it("récompense le passage à « lu » avec une clé liée au livre", async () => {
            jest.spyOn(UserBook, "findOne")
                .mockResolvedValueOnce(existingUserBook(ReadingStatus.READING))
                .mockResolvedValueOnce(new UserBook());

            await resolver.updateUserBook(
                { id: "ub-1", status: ReadingStatus.READ },
                makeContext(user)
            );

            expect(grantXp).toHaveBeenCalledWith(
                user,
                UserActionType.BOOK_FINISHED,
                expect.objectContaining({ xpKey: "book:book-1" })
            );
        });

        it("ne récompense rien si le livre était déjà lu", async () => {
            jest.spyOn(UserBook, "findOne")
                .mockResolvedValueOnce(existingUserBook(ReadingStatus.READ))
                .mockResolvedValueOnce(new UserBook());

            await resolver.updateUserBook(
                { id: "ub-1", status: ReadingStatus.READ },
                makeContext(user)
            );

            expect(grantXp).not.toHaveBeenCalled();
        });

        it("ne cherche que dans la bibliothèque de l'utilisateur connecté", async () => {
            const findOne = jest.spyOn(UserBook, "findOne").mockResolvedValue(null);

            await expect(
                resolver.updateUserBook({ id: "ub-other" }, makeContext(user))
            ).rejects.toMatchObject({ statusCode: 404 });
            expect(findOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: "ub-other", user: { id: "user-1" } },
                })
            );
        });
    });
});
