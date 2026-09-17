import { dataSource } from "../../database/config/datasource";
import { User } from "../../database/entities/user/user";
import { UserActions } from "../../database/entities/user/user-actions";
import { UserActionType } from "../../types/types";
import { ActionXPMap } from "../../utils/actionsXpMap";
import { grantXpService } from "./grant-xp-service";

jest.mock("../../database/config/datasource", () => ({
    dataSource: { transaction: jest.fn() },
}));

const transactionMock = dataSource.transaction as jest.Mock;

function makeUser(xp: number, level: number): User {
    const user = new User();
    user.id = "user-1";
    user.xp = xp;
    user.level = level;
    return user;
}

function mockManager({ exists = false } = {}) {
    const saved: unknown[] = [];
    const manager = {
        exists: jest.fn(async () => exists),
        save: jest.fn(async (entity: unknown) => saved.push(entity)),
    };
    transactionMock.mockImplementation(async (cb) => cb(manager));
    return { manager, saved };
}

describe("grantXpService", () => {
    it("persists the updated user and the action log in a single transaction", async () => {
        const { saved } = mockManager();

        const user = makeUser(0, 1);
        const granted = await grantXpService(user, UserActionType.BOOK_ADDED, {
            xpKey: "isbn13:9782070612758",
            targetId: "42",
            metadata: { title: "Le Petit Prince" },
        });

        expect(granted).toBe(true);
        expect(transactionMock).toHaveBeenCalledTimes(1);
        expect(saved[0]).toBe(user);
        expect(user.xp).toBe(ActionXPMap[UserActionType.BOOK_ADDED]);

        const action = saved[1] as UserActions;
        expect(action).toBeInstanceOf(UserActions);
        expect(action.type).toBe(UserActionType.BOOK_ADDED);
        expect(action.xp).toBe(ActionXPMap[UserActionType.BOOK_ADDED]);
        expect(action.xpKey).toBe("isbn13:9782070612758");
        expect(action.targetId).toBe("42");
        expect(action.metadata).toBe(JSON.stringify({ title: "Le Petit Prince" }));
    });

    it("levels the user up when the XP threshold is crossed", async () => {
        mockManager();

        // 80 XP + 50 (BOOK_ADDED) = 130 → level 2, 30 XP remaining
        const user = makeUser(80, 1);
        await grantXpService(user, UserActionType.BOOK_ADDED, { xpKey: "k" });

        expect(user.level).toBe(2);
        expect(user.xp).toBe(30);
    });

    it("looks up an existing grant for the same user, action type and key", async () => {
        const { manager } = mockManager();

        await grantXpService(makeUser(0, 1), UserActionType.BOOK_RECOMMENDED, {
            xpKey: "book:b-1",
        });

        expect(manager.exists).toHaveBeenCalledWith(UserActions, {
            where: {
                user: { id: "user-1" },
                type: UserActionType.BOOK_RECOMMENDED,
                xpKey: "book:b-1",
            },
        });
    });

    it("keeps rewarding the same action on a different target", async () => {
        // Seule la clé déjà récompensée est ignorée : recommander un autre
        // livre reste une nouvelle action, donc de l'XP.
        const rewarded = new Set(["book:b-1"]);
        transactionMock.mockImplementation(async (cb) =>
            cb({
                exists: jest.fn(
                    async (_entity: unknown, options: { where: { xpKey: string } }) =>
                        rewarded.has(options.where.xpKey)
                ),
                save: jest.fn(),
            })
        );

        const user = makeUser(0, 1);
        const again = await grantXpService(
            user,
            UserActionType.BOOK_RECOMMENDED,
            { xpKey: "book:b-1" }
        );
        const other = await grantXpService(
            user,
            UserActionType.BOOK_RECOMMENDED,
            { xpKey: "book:b-2" }
        );

        expect(again).toBe(false);
        expect(other).toBe(true);
        expect(user.xp).toBe(ActionXPMap[UserActionType.BOOK_RECOMMENDED]);
    });

    it("grants nothing when the key has already been rewarded", async () => {
        const { manager } = mockManager({ exists: true });

        const user = makeUser(40, 1);
        const granted = await grantXpService(
            user,
            UserActionType.BOOK_RECOMMENDED,
            { xpKey: "book:b-1" }
        );

        expect(granted).toBe(false);
        expect(manager.save).not.toHaveBeenCalled();
        expect(user.xp).toBe(40);
        expect(user.level).toBe(1);
    });

    it("grants nothing and restores the user when a concurrent grant wins the unique index", async () => {
        transactionMock.mockImplementation(async (cb) => {
            await cb({ exists: jest.fn(async () => false), save: jest.fn() });
            throw Object.assign(new Error("duplicate key"), { code: "23505" });
        });

        const user = makeUser(80, 1);
        const granted = await grantXpService(user, UserActionType.BOOK_ADDED, {
            xpKey: "k",
        });

        expect(granted).toBe(false);
        expect(user.xp).toBe(80);
        expect(user.level).toBe(1);
    });

    it("propagates other errors and restores the user", async () => {
        transactionMock.mockImplementation(async (cb) => {
            await cb({ exists: jest.fn(async () => false), save: jest.fn() });
            throw new Error("db down");
        });

        const user = makeUser(80, 1);
        await expect(
            grantXpService(user, UserActionType.BOOK_ADDED, { xpKey: "k" })
        ).rejects.toThrow("db down");
        expect(user.xp).toBe(80);
        expect(user.level).toBe(1);
    });
});
