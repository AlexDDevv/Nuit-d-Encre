import { BookReview } from "../../../database/entities/book/bookReview";
import { BookReviewComment } from "../../../database/entities/book/bookReviewComment";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { Roles } from "../../../types/types";
import { BookReviewCommentsResolver } from "./book-review-comment-resolver";

const author = makeUser("author");
const stranger = makeUser("stranger");
const admin = makeUser("admin", Roles.Admin);

describe("BookReviewCommentsResolver", () => {
    const resolver = new BookReviewCommentsResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(BookReviewComment);
    });

    describe("createBookReviewComment", () => {
        it("refuse un commentaire vide ou composé d'espaces", async () => {
            const findReview = jest.spyOn(BookReview, "findOne");

            await expect(
                resolver.createBookReviewComment(
                    { reviewId: "review-1", content: "   " },
                    makeContext(author)
                )
            ).rejects.toMatchObject({ statusCode: 400 });
            expect(findReview).not.toHaveBeenCalled();
        });

        it("enregistre le contenu sans les espaces superflus", async () => {
            jest.spyOn(BookReview, "findOne").mockResolvedValue(new BookReview());

            const comment = await resolver.createBookReviewComment(
                { reviewId: "review-1", content: "  Bien vu !  " },
                makeContext(author)
            );

            expect(comment.content).toBe("Bien vu !");
            expect(comment.user).toBe(author);
        });
    });

    describe("deleteBookReviewComment", () => {
        beforeEach(() => {
            jest.spyOn(BookReviewComment, "findOne").mockResolvedValue(
                Object.assign(new BookReviewComment(), { id: "c-1", user: author })
            );
        });

        it("refuse un utilisateur qui n'est pas l'auteur du commentaire", async () => {
            await expect(
                resolver.deleteBookReviewComment("c-1", makeContext(stranger))
            ).rejects.toMatchObject({ statusCode: 403 });
            expect(BookReviewComment.prototype.remove).not.toHaveBeenCalled();
        });

        it.each([
            ["l'auteur", author],
            ["un admin", admin],
        ])("autorise %s", async (_label, user) => {
            await expect(
                resolver.deleteBookReviewComment("c-1", makeContext(user))
            ).resolves.toBe(true);
        });
    });
});
