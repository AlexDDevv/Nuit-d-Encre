import { User } from "../../../database/entities/user/user";
import { UserFollow } from "../../../database/entities/user/user-follow";
import { makeContext, makeUser } from "../../../test/factories";
import { FollowResolver } from "./follow-resolver";

const me = makeUser("me");

describe("FollowResolver.followUser", () => {
    const resolver = new FollowResolver();

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it("interdit de se suivre soi-même", async () => {
        const insert = jest.spyOn(UserFollow, "insert");

        await expect(
            resolver.followUser("me", makeContext(me))
        ).rejects.toMatchObject({ statusCode: 400 });
        expect(insert).not.toHaveBeenCalled();
    });

    it("refuse de suivre un utilisateur inexistant", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null);
        const insert = jest.spyOn(UserFollow, "insert");

        await expect(
            resolver.followUser("ghost", makeContext(me))
        ).rejects.toMatchObject({ statusCode: 404 });
        expect(insert).not.toHaveBeenCalled();
    });

    it("est idempotent quand l'abonnement existe déjà", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(makeUser("other"));
        jest.spyOn(UserFollow, "insert").mockRejectedValue(
            Object.assign(new Error("duplicate key"), { code: "23505" })
        );

        await expect(resolver.followUser("other", makeContext(me))).resolves.toBe(
            true
        );
    });

    it("propage les autres erreurs d'insertion", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(makeUser("other"));
        jest.spyOn(UserFollow, "insert").mockRejectedValue(new Error("db down"));

        await expect(
            resolver.followUser("other", makeContext(me))
        ).rejects.toThrow("db down");
    });
});
