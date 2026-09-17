import { BookReview } from "../../../database/entities/book/bookReview";
import { BookReviewVote } from "../../../database/entities/book/bookReviewVote";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { UserActionType } from "../../../types/types";
import { BookReviewVotesResolver } from "./book-review-vote-resolver";

jest.mock("../../../services/grind/grant-xp-service");

const grantXp = grantXpService as jest.Mock;

const author = makeUser("author");
const voter = makeUser("voter");

function makeReview(): BookReview {
    return Object.assign(new BookReview(), { id: "review-1", user: author });
}

function makeVote(isHelpful: boolean): BookReviewVote {
    return Object.assign(new BookReviewVote(), { id: "vote-1", isHelpful });
}

const helpfulVoteXp = expect.objectContaining({
    xpKey: "review:review-1:voter:voter",
});

describe("BookReviewVotesResolver", () => {
    const resolver = new BookReviewVotesResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(BookReviewVote);
        jest.spyOn(BookReview, "findOne").mockResolvedValue(makeReview());
    });

    describe("voteOnReview", () => {
        it("interdit de voter sur sa propre critique", async () => {
            await expect(
                resolver.voteOnReview(
                    { reviewId: "review-1", isHelpful: true },
                    makeContext(author)
                )
            ).rejects.toMatchObject({ statusCode: 403 });
            expect(grantXp).not.toHaveBeenCalled();
        });

        it("récompense l'auteur d'un premier vote utile avec une clé propre au votant", async () => {
            jest.spyOn(BookReviewVote, "findOne").mockResolvedValue(null);

            const result = await resolver.voteOnReview(
                { reviewId: "review-1", isHelpful: true },
                makeContext(voter)
            );

            expect(result.action).toBe("created");
            expect(grantXp).toHaveBeenCalledWith(
                author,
                UserActionType.REVIEW_VOTED_HELPFUL,
                helpfulVoteXp
            );
        });

        it("ne récompense pas un vote « pas utile »", async () => {
            jest.spyOn(BookReviewVote, "findOne").mockResolvedValue(null);

            await resolver.voteOnReview(
                { reviewId: "review-1", isHelpful: false },
                makeContext(voter)
            );

            expect(grantXp).not.toHaveBeenCalled();
        });
    });

    describe("toggleHelpfulVote", () => {
        it("interdit de voter sur sa propre critique", async () => {
            await expect(
                resolver.toggleHelpfulVote("review-1", makeContext(author))
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("retire un vote utile existant sans toucher à l'XP", async () => {
            jest.spyOn(BookReviewVote, "findOne").mockResolvedValue(
                makeVote(true)
            );

            const result = await resolver.toggleHelpfulVote(
                "review-1",
                makeContext(voter)
            );

            expect(result.action).toBe("removed");
            expect(grantXp).not.toHaveBeenCalled();
        });

        it.each([
            ["crée un vote utile", null, "created"],
            ["convertit un vote « pas utile »", makeVote(false), "updated"],
        ])("%s avec la même clé d'XP par votant", async (_label, existing, action) => {
            jest.spyOn(BookReviewVote, "findOne").mockResolvedValue(existing);

            const result = await resolver.toggleHelpfulVote(
                "review-1",
                makeContext(voter)
            );

            expect(result.action).toBe(action);
            expect(grantXp).toHaveBeenCalledWith(
                author,
                UserActionType.REVIEW_VOTED_HELPFUL,
                helpfulVoteXp
            );
        });
    });
});
