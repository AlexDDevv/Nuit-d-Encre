import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { dataSource } from "../database/config/datasource";
import { User } from "../database/entities/user/user";
import { AppError } from "../middlewares/error-handler";
import { Roles } from "../types/types";
import { login, register } from "./auth-service";

jest.mock("../database/config/datasource", () => ({
    dataSource: { getRepository: jest.fn() },
}));

const repoMock = { findOne: jest.fn() };
(dataSource.getRepository as jest.Mock).mockReturnValue(repoMock);

const JWT_SECRET = "test-secret";

beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
});

describe("register", () => {
    it("hashes the password and saves the new user", async () => {
        repoMock.findOne.mockResolvedValue(null);
        const save = jest.fn();
        const createSpy = jest
            .spyOn(User, "create")
            .mockImplementation((data: unknown) => ({ ...(data as object), save } as never));

        const user = (await register(
            "new@example.com",
            "secret",
            "newUser",
            Roles.User
        )) as unknown as { hashedPassword: string; level: number; xp: number };

        expect(createSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "new@example.com",
                userName: "newUser",
                role: Roles.User,
                level: 1,
                xp: 0,
            })
        );
        expect(save).toHaveBeenCalledTimes(1);
        // The plain-text password must never be stored
        expect(user.hashedPassword).not.toBe("secret");
        await expect(
            argon2.verify(user.hashedPassword, "secret")
        ).resolves.toBe(true);

        createSpy.mockRestore();
    });

    it("rejects an email that is already in use", async () => {
        repoMock.findOne.mockResolvedValue({ id: 1 });

        await expect(
            register("taken@example.com", "secret", "user", Roles.User)
        ).rejects.toMatchObject({
            message: "Email already exists",
            statusCode: 400,
        });
    });
});

describe("login", () => {
    function makeCookies() {
        return { set: jest.fn() } as unknown as Parameters<typeof login>[2];
    }

    it("sets a signed JWT cookie for valid credentials", async () => {
        const hashedPassword = await argon2.hash("secret");
        repoMock.findOne.mockResolvedValue({ id: 7, hashedPassword });
        const cookies = makeCookies();

        const result = await login("user@example.com", "secret", cookies);

        expect(result.cookieSet).toBe(true);
        const setMock = (cookies as unknown as { set: jest.Mock }).set;
        expect(setMock).toHaveBeenCalledTimes(1);
        const [name, token, options] = setMock.mock.calls[0];
        expect(name).toBe("token");
        expect(options).toMatchObject({ httpOnly: true, signed: true });
        // The token must identify the logged-in user
        expect(jwt.verify(token, JWT_SECRET)).toMatchObject({ id: 7 });
    });

    it("rejects an unknown email with a 401", async () => {
        repoMock.findOne.mockResolvedValue(null);

        await expect(
            login("ghost@example.com", "secret", makeCookies())
        ).rejects.toMatchObject({
            message: "Invalid identifiers",
            statusCode: 401,
        });
    });

    it("rejects a wrong password without setting a cookie", async () => {
        const hashedPassword = await argon2.hash("right-password");
        repoMock.findOne.mockResolvedValue({ id: 7, hashedPassword });
        const cookies = makeCookies();

        await expect(
            login("user@example.com", "wrong-password", cookies)
        ).rejects.toBeInstanceOf(AppError);
        expect(
            (cookies as unknown as { set: jest.Mock }).set
        ).not.toHaveBeenCalled();
    });
});
