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
        const setNulls: { target: unknown; where: unknown }[] = [];

        const manager = {
            delete: jest.fn(async (entity: unknown) => {
                deletes.push(entity);
            }),
            createQueryBuilder: jest.fn(() => {
                const qb: Record<string, unknown> = {};
                let target: unknown;
                let where: unknown;
                qb.update = (t: unknown) => {
                    target = t;
                    return qb;
                };
                qb.set = () => qb;
                qb.where = (condition: unknown) => {
                    where = condition;
                    return qb;
                };
                qb.execute = async () => {
                    setNulls.push({ target, where });
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
        const targets = setNulls.map((s) => s.target);
        expect(targets).toEqual(
            expect.arrayContaining([
                BookReview,
                BookRecommendation,
                BookReviewComment,
                Book,
                Author,
                Category,
            ]),
        );

        // La colonne FK détachée doit correspondre à l'entité (régression : Category
        // utilise "createdById", pas "userId")
        const findSetNull = (entity: unknown) =>
            setNulls.find((s) => s.target === entity);

        expect(findSetNull(Category)?.where).toEqual(
            expect.stringContaining("createdById"),
        );
        for (const entity of [
            BookReview,
            BookRecommendation,
            BookReviewComment,
            Book,
            Author,
        ]) {
            expect(findSetNull(entity)?.where).toEqual(
                expect.stringContaining('"userId"'),
            );
        }
    });
});
