import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { dataSource } from "../database/config/datasource";
import { User } from "../database/entities/user/user";
import { AppError } from "../middlewares/error-handler";
import { Roles } from "../types/types";
import {
    login,
    register,
    resolveOrCreateGoogleUser,
    googleAuth,
} from "./auth-service";

jest.mock("../database/config/datasource", () => ({
    dataSource: { getRepository: jest.fn() },
}));

const getTokenMock = jest.fn();
const verifyIdTokenMock = jest.fn();
jest.mock("google-auth-library", () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        getToken: getTokenMock,
        verifyIdToken: verifyIdTokenMock,
    })),
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

    it("rejects a Google-only account (null password) without setting a cookie", async () => {
        repoMock.findOne.mockResolvedValue({ id: 9, hashedPassword: null });
        const cookies = makeCookies();

        await expect(
            login("google-user@example.com", "whatever", cookies)
        ).rejects.toMatchObject({
            message: "Invalid identifiers",
            statusCode: 401,
        });
        expect(
            (cookies as unknown as { set: jest.Mock }).set
        ).not.toHaveBeenCalled();
    });
});

describe("resolveOrCreateGoogleUser", () => {
    const profile = {
        sub: "google-sub-123",
        email: "gaby@example.com",
        name: "Gaby Lecteur",
        picture: "https://img/pic.jpg",
    };

    it("returns the existing user matched by googleId", async () => {
        const existing = { id: 1, googleId: "google-sub-123" };
        repoMock.findOne.mockResolvedValueOnce(existing);

        const user = await resolveOrCreateGoogleUser(profile);

        expect(user).toBe(existing);
        expect(repoMock.findOne).toHaveBeenCalledWith({
            where: { googleId: "google-sub-123" },
        });
    });

    it("links googleId to an existing account matched by email", async () => {
        const save = jest.fn();
        const existing = {
            id: 2,
            email: "gaby@example.com",
            avatar: null,
            save,
        };
        // 1st findOne (by googleId) -> null ; 2nd (by email) -> existing
        repoMock.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(existing);

        const user = (await resolveOrCreateGoogleUser(profile)) as unknown as {
            googleId: string;
            avatar: string | null;
        };

        expect(user.googleId).toBe("google-sub-123");
        expect(user.avatar).toBe("https://img/pic.jpg");
        expect(save).toHaveBeenCalledTimes(1);
    });

    it("creates a new user with a unique userName when none matches", async () => {
        const save = jest.fn();
        // findOne: by googleId -> null, by email -> null,
        // then userName uniqueness probe -> null (name is free)
        repoMock.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        const createSpy = jest
            .spyOn(User, "create")
            .mockImplementation(
                (data: unknown) => ({ ...(data as object), save } as never)
            );

        const user = (await resolveOrCreateGoogleUser(profile)) as unknown as {
            email: string;
            googleId: string;
            userName: string;
            hashedPassword: string | null;
            level: number;
            xp: number;
        };

        expect(user.email).toBe("gaby@example.com");
        expect(user.googleId).toBe("google-sub-123");
        expect(user.userName).toBe("Gaby Lecteur");
        expect(user.hashedPassword).toBeNull();
        expect(user.level).toBe(1);
        expect(user.xp).toBe(0);
        expect(save).toHaveBeenCalledTimes(1);

        createSpy.mockRestore();
    });
});

describe("googleAuth", () => {
    function makeCookies() {
        return { set: jest.fn() } as unknown as Parameters<typeof googleAuth>[1];
    }

    beforeEach(() => {
        getTokenMock.mockReset();
        verifyIdTokenMock.mockReset();
        repoMock.findOne.mockReset();
    });

    it("exchanges the code, resolves the user and sets the cookie", async () => {
        getTokenMock.mockResolvedValue({ tokens: { id_token: "id-tok" } });
        verifyIdTokenMock.mockResolvedValue({
            getPayload: () => ({
                sub: "sub-1",
                email: "user@example.com",
                name: "User One",
                picture: null,
                email_verified: true,
            }),
        });
        // resolveOrCreateGoogleUser -> found by googleId
        repoMock.findOne.mockResolvedValueOnce({ id: 42, googleId: "sub-1" });
        const cookies = makeCookies();

        const result = await googleAuth("auth-code", cookies);

        expect(result.cookieSet).toBe(true);
        expect(getTokenMock).toHaveBeenCalledWith("auth-code");
        const setMock = (cookies as unknown as { set: jest.Mock }).set;
        expect(setMock).toHaveBeenCalledTimes(1);
        expect(setMock.mock.calls[0][0]).toBe("token");
    });

    it("rejects when Google returns no id_token", async () => {
        getTokenMock.mockResolvedValue({ tokens: {} });
        const cookies = makeCookies();

        await expect(googleAuth("bad-code", cookies)).rejects.toMatchObject({
            statusCode: 401,
        });
        expect(
            (cookies as unknown as { set: jest.Mock }).set
        ).not.toHaveBeenCalled();
    });

    it("rejects when Google returns an unverified email", async () => {
        getTokenMock.mockResolvedValue({ tokens: { id_token: "id-tok" } });
        verifyIdTokenMock.mockResolvedValue({
            getPayload: () => ({
                sub: "sub-1",
                email: "user@example.com",
                email_verified: false,
            }),
        });
        const cookies = makeCookies();

        await expect(googleAuth("auth-code", cookies)).rejects.toMatchObject({
            statusCode: 401,
        });
        expect(
            (cookies as unknown as { set: jest.Mock }).set
        ).not.toHaveBeenCalled();
    });
});
