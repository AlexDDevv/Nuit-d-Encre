import { makeUser } from "../test/factories";
import { Roles } from "../types/types";
import { isOwnerOrAdmin } from "./authorizations";

describe("isOwnerOrAdmin", () => {
    it("autorise le propriétaire", () => {
        expect(isOwnerOrAdmin("user-1", makeUser("user-1"))).toBe(true);
    });

    it("autorise un admin sur la ressource d'un autre", () => {
        expect(isOwnerOrAdmin("user-1", makeUser("admin", Roles.Admin))).toBe(true);
    });

    it("refuse un autre utilisateur, y compris modérateur", () => {
        expect(isOwnerOrAdmin("user-1", makeUser("user-2"))).toBe(false);
        expect(isOwnerOrAdmin("user-1", makeUser("mod", Roles.Moderator))).toBe(
            false
        );
    });

    it("refuse un visiteur non connecté", () => {
        expect(isOwnerOrAdmin("user-1", null)).toBe(false);
        expect(isOwnerOrAdmin("user-1", undefined)).toBe(false);
    });

    it("refuse une ressource sans propriétaire à un non-admin", () => {
        // Les resolvers passent "" quand la relation user est absente.
        expect(isOwnerOrAdmin("", makeUser("user-1"))).toBe(false);
    });
});
