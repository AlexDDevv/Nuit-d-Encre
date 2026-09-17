import { UserBook } from "../../../database/entities/user/user-book";
import { makeContext, makeUser, stubPersistence } from "../../../test/factories";
import { ProfileResolver } from "./profile-resolver";

const user = makeUser("user-1");

function makeUserBook(id: string, favoriteRank: number | null = null): UserBook {
    return Object.assign(new UserBook(), {
        id,
        isFavorite: favoriteRank !== null,
        favoriteRank,
    });
}

describe("ProfileResolver.setFavoriteBook", () => {
    const resolver = new ProfileResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
        stubPersistence(UserBook);
    });

    it.each([0, 4])("refuse le rang %i (hors de 1 à 3)", async (rank) => {
        const findOne = jest.spyOn(UserBook, "findOne");

        await expect(
            resolver.setFavoriteBook("ub-1", rank, makeContext(user))
        ).rejects.toMatchObject({ statusCode: 400 });
        expect(findOne).not.toHaveBeenCalled();
    });

    it("ne cherche que dans la bibliothèque de l'utilisateur connecté", async () => {
        const findOne = jest.spyOn(UserBook, "findOne").mockResolvedValue(null);

        await expect(
            resolver.setFavoriteBook("ub-other", 1, makeContext(user))
        ).rejects.toMatchObject({ statusCode: 404 });
        expect(findOne).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: "ub-other", user: { id: "user-1" } },
            })
        );
    });

    it("libère le rang occupé par un autre favori", async () => {
        const target = makeUserBook("ub-1");
        const previous = makeUserBook("ub-2", 1);
        jest.spyOn(UserBook, "findOne")
            .mockResolvedValueOnce(target)
            .mockResolvedValueOnce(previous);

        const result = await resolver.setFavoriteBook("ub-1", 1, makeContext(user));

        expect(result).toMatchObject({ isFavorite: true, favoriteRank: 1 });
        expect(previous).toMatchObject({ isFavorite: false, favoriteRank: null });
    });

    it("garde le livre favori s'il occupe déjà ce rang", async () => {
        const target = makeUserBook("ub-1", 2);
        jest.spyOn(UserBook, "findOne")
            .mockResolvedValueOnce(target)
            .mockResolvedValueOnce(target);

        const result = await resolver.setFavoriteBook("ub-1", 2, makeContext(user));

        expect(result).toMatchObject({ isFavorite: true, favoriteRank: 2 });
    });
});
