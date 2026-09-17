import { Book } from "../../../database/entities/book/book";
import { BookRecommendation } from "../../../database/entities/book/bookRecommendation";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { UserActionType } from "../../../types/types";
import { BookRecommendationsResolver } from "./book-recommendation-resolver";

jest.mock("../../../services/grind/grant-xp-service");

const grantXp = grantXpService as jest.Mock;

const user = makeUser("user-1");

describe("BookRecommendationsResolver.toggleBookRecommendation", () => {
    const resolver = new BookRecommendationsResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(BookRecommendation);
        jest.spyOn(Book, "findOne").mockResolvedValue(
            Object.assign(new Book(), { id: "book-1", title: "Dune" })
        );
    });

    it("crée la recommandation et la récompense avec une clé liée au livre", async () => {
        jest.spyOn(BookRecommendation, "findOne").mockResolvedValue(null);

        const result = await resolver.toggleBookRecommendation(
            { bookId: "book-1" },
            makeContext(user)
        );

        expect(result.action).toBe("created");
        expect(grantXp).toHaveBeenCalledWith(
            user,
            UserActionType.BOOK_RECOMMENDED,
            expect.objectContaining({ xpKey: "book:book-1" })
        );
    });

    it("retire une recommandation existante sans toucher à l'XP", async () => {
        jest.spyOn(BookRecommendation, "findOne").mockResolvedValue(
            new BookRecommendation()
        );

        const result = await resolver.toggleBookRecommendation(
            { bookId: "book-1" },
            makeContext(user)
        );

        expect(result.action).toBe("removed");
        expect(BookRecommendation.prototype.remove).toHaveBeenCalledTimes(1);
        expect(grantXp).not.toHaveBeenCalled();
    });
});
