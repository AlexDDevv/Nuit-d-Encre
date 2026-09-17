import { AuthCheckerFn, ResolverData } from "type-graphql";
import { whoami } from "../services/auth-service";
import { makeContext, makeUser } from "../test/factories";
import { Context, Roles } from "../types/types";
import { customAuthChecker } from "./auth-checker";

jest.mock("../services/auth-service");

const whoamiMock = whoami as jest.Mock;

function check(context: Context, roles: string[]) {
    return (customAuthChecker as AuthCheckerFn<Context>)(
        { context } as ResolverData<Context>,
        roles
    );
}

describe("customAuthChecker", () => {
    it("refuse un visiteur sans session valide", async () => {
        whoamiMock.mockRejectedValue(new Error("No token provided"));

        await expect(check(makeContext(null), [])).resolves.toBe(false);
    });

    it("refuse un jeton dont l'utilisateur n'existe plus", async () => {
        whoamiMock.mockResolvedValue(null);

        await expect(check(makeContext(null), [])).resolves.toBe(false);
    });

    it("autorise tout utilisateur connecté quand aucun rôle n'est exigé et l'expose dans le contexte", async () => {
        const user = makeUser("user-1");
        whoamiMock.mockResolvedValue(user);
        const context = makeContext(null);

        await expect(check(context, [])).resolves.toBe(true);
        expect(context.user).toBe(user);
    });

    it("refuse un utilisateur dont le rôle n'est pas exigé", async () => {
        whoamiMock.mockResolvedValue(makeUser("user-1", Roles.User));

        await expect(check(makeContext(null), [Roles.Admin])).resolves.toBe(
            false
        );
    });

    it("autorise un utilisateur ayant l'un des rôles exigés", async () => {
        whoamiMock.mockResolvedValue(makeUser("admin", Roles.Admin));

        await expect(
            check(makeContext(null), [Roles.User, Roles.Admin])
        ).resolves.toBe(true);
    });
});
