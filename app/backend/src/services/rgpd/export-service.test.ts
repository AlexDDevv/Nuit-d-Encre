import { User } from "../../database/entities/user/user";
import { exportUserData } from "./export-service";

jest.mock("../../database/entities/user/user");

describe("exportUserData", () => {
    it("agrège le profil et les contributions en un JSON structuré", async () => {
        const fakeUser = {
            id: "u1",
            email: "reader@example.com",
            userName: "Reader",
            bio: "J'aime lire",
            level: 3,
            xp: 420,
            createdAt: new Date("2025-01-01T00:00:00.000Z"),
            userBooks: [{ id: "ub1", status: "read" }],
            bookReviews: [{ id: "r1", rating: 5, reviewText: "Super" }],
            bookRecommendations: [],
            bookReviewVotes: [],
            actions: [{ type: "BOOK_ADDED", xp: 50 }],
            following: [],
            followers: [],
            books: [],
            authors: [],
        };

        (User.findOne as jest.Mock) = jest.fn().mockResolvedValue(fakeUser);

        const json = await exportUserData("u1");
        const parsed = JSON.parse(json);

        expect(parsed.profil.email).toBe("reader@example.com");
        expect(parsed.profil.hashedPassword).toBeUndefined();
        expect(parsed.bibliotheque).toHaveLength(1);
        expect(parsed.critiques[0].rating).toBe(5);
        expect(parsed.journalActivite[0].type).toBe("BOOK_ADDED");
    });

    it("échoue si l'utilisateur est introuvable", async () => {
        (User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);
        await expect(exportUserData("nope")).rejects.toThrow();
    });
});
