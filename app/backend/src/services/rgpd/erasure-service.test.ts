import { dataSource } from "../../database/config/datasource";
import { Author } from "../../database/entities/author/author";
import { Book } from "../../database/entities/book/book";
import { BookRecommendation } from "../../database/entities/book/bookRecommendation";
import { BookReview } from "../../database/entities/book/bookReview";
import { BookReviewComment } from "../../database/entities/book/bookReviewComment";
import { BookReviewVote } from "../../database/entities/book/bookReviewVote";
import { Category } from "../../database/entities/category/category";
import { User } from "../../database/entities/user/user";
import { UserActions } from "../../database/entities/user/user-actions";
import { eraseUserAccount } from "./erasure-service";

jest.mock("../../database/config/datasource", () => ({
    dataSource: { transaction: jest.fn() },
}));

const transactionMock = dataSource.transaction as jest.Mock;

describe("eraseUserAccount", () => {
    it("supprime le personnel, anonymise les contributions et détache le catalogue en une transaction", async () => {
        const deletes: unknown[] = [];
        const setNulls: unknown[] = [];

        const manager = {
            delete: jest.fn(async (entity: unknown) => {
                deletes.push(entity);
            }),
            createQueryBuilder: jest.fn(() => {
                const qb: Record<string, unknown> = {};
                let target: unknown;
                qb.update = (t: unknown) => {
                    target = t;
                    return qb;
                };
                qb.set = () => qb;
                qb.where = () => qb;
                qb.execute = async () => {
                    setNulls.push(target);
                };
                return qb;
            }),
        };

        transactionMock.mockImplementation(async (cb) => cb(manager));

        await eraseUserAccount("user-123");

        expect(transactionMock).toHaveBeenCalledTimes(1);
        // Données strictement personnelles supprimées
        expect(deletes).toContain(BookReviewVote);
        expect(deletes).toContain(UserActions);
        // Compte supprimé en dernier (déclenche la cascade user_book/user_follow)
        expect(deletes[deletes.length - 1]).toBe(User);
        // Contributions anonymisées / détachées (SET NULL)
        expect(setNulls).toEqual(
            expect.arrayContaining([
                BookReview,
                BookRecommendation,
                BookReviewComment,
                Book,
                Author,
                Category,
            ]),
        );
    });
});
