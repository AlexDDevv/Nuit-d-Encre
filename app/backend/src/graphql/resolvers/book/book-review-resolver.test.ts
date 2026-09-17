import { Book } from "../../../database/entities/book/book";
import { BookReview } from "../../../database/entities/book/bookReview";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { Roles, UserActionType } from "../../../types/types";
import { BookReviewsResolver } from "./book-review-resolver";

jest.mock("../../../services/grind/grant-xp-service");

const grantXp = grantXpService as jest.Mock;

const author = makeUser("author");
const stranger = makeUser("stranger");
const admin = makeUser("admin", Roles.Admin);

function makeBook(): Book {
    return Object.assign(new Book(), { id: "book-1", title: "L'Étranger" });
}

function makeReview(): BookReview {
    return Object.assign(new BookReview(), {
        id: "review-1",
        rating: 4,
        reviewText: "Très bon.",
        user: author,
        book: makeBook(),
    });
}

describe("BookReviewsResolver", () => {
    const resolver = new BookReviewsResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(BookReview);
    });

    describe("createBookReview", () => {
        beforeEach(() => {
            jest.spyOn(Book, "findOne").mockResolvedValue(makeBook());
        });

        it("refuse une seconde critique sur le même livre", async () => {
            jest.spyOn(BookReview, "findOne").mockResolvedValue(makeReview());

            await expect(
                resolver.createBookReview(
                    { bookId: "book-1", rating: 5 },
                    makeContext(author)
                )
            ).rejects.toMatchObject({ statusCode: 409 });
            expect(grantXp).not.toHaveBeenCalled();
        });

        it("récompense la critique avec une clé liée au livre", async () => {
            jest.spyOn(BookReview, "findOne").mockResolvedValue(null);

            await resolver.createBookReview(
                { bookId: "book-1", rating: 5, reviewText: "Court." },
                makeContext(author)
            );

            expect(grantXp).toHaveBeenCalledTimes(1);
            expect(grantXp).toHaveBeenCalledWith(
                author,
                UserActionType.REVIEW_CREATED,
                expect.objectContaining({ xpKey: "book:book-1" })
            );
        });

        it("accorde le bonus de critique détaillée au-delà de 200 caractères", async () => {
            jest.spyOn(BookReview, "findOne").mockResolvedValue(null);

            await resolver.createBookReview(
                { bookId: "book-1", rating: 5, reviewText: "a".repeat(201) },
                makeContext(author)
            );

            expect(grantXp).toHaveBeenCalledWith(
                author,
                UserActionType.DETAILED_REVIEW_BONUS,
                expect.objectContaining({ xpKey: "book:book-1" })
            );
        });

        it("n'accorde pas le bonus à exactement 200 caractères", async () => {
            jest.spyOn(BookReview, "findOne").mockResolvedValue(null);

            await resolver.createBookReview(
                { bookId: "book-1", rating: 5, reviewText: "a".repeat(200) },
                makeContext(author)
            );

            expect(grantXp).not.toHaveBeenCalledWith(
                author,
                UserActionType.DETAILED_REVIEW_BONUS,
                expect.anything()
            );
        });
    });

    describe.each([
        [
            "updateBookReview",
            (user: ReturnType<typeof makeUser>) =>
                resolver.updateBookReview(
                    { id: "review-1", rating: 1 },
                    makeContext(user)
                ),
        ],
        [
            "deleteBookReview",
            (user: ReturnType<typeof makeUser>) =>
                resolver.deleteBookReview("review-1", makeContext(user)),
        ],
    ])("%s", (_name, run) => {
        beforeEach(() => {
            jest.spyOn(BookReview, "findOne").mockResolvedValue(makeReview());
        });

        it("refuse un utilisateur qui n'est pas l'auteur de la critique", async () => {
            await expect(run(stranger)).rejects.toMatchObject({
                statusCode: 403,
            });
            expect(BookReview.prototype.save).not.toHaveBeenCalled();
            expect(BookReview.prototype.remove).not.toHaveBeenCalled();
        });

        it.each([
            ["l'auteur", author],
            ["un admin", admin],
        ])("autorise %s", async (_label, user) => {
            await expect(run(user)).resolves.toBeDefined();
        });
    });
});
