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
    user.xp = xp;
    user.level = level;
    return user;
}

describe("grantXpService", () => {
    it("persists the updated user and the action log in a single transaction", async () => {
        const saved: unknown[] = [];
        transactionMock.mockImplementation(async (cb) =>
            cb({ save: jest.fn(async (entity: unknown) => saved.push(entity)) })
        );

        const user = makeUser(0, 1);
        await grantXpService(user, UserActionType.BOOK_ADDED, {
            targetId: "42",
            metadata: { title: "Le Petit Prince" },
        });

        expect(transactionMock).toHaveBeenCalledTimes(1);
        expect(saved[0]).toBe(user);
        expect(user.xp).toBe(ActionXPMap[UserActionType.BOOK_ADDED]);

        const action = saved[1] as UserActions;
        expect(action).toBeInstanceOf(UserActions);
        expect(action.type).toBe(UserActionType.BOOK_ADDED);
        expect(action.xp).toBe(ActionXPMap[UserActionType.BOOK_ADDED]);
        expect(action.targetId).toBe("42");
        expect(action.metadata).toBe(JSON.stringify({ title: "Le Petit Prince" }));
    });

    it("levels the user up when the XP threshold is crossed", async () => {
        transactionMock.mockImplementation(async (cb) =>
            cb({ save: jest.fn() })
        );

        // 80 XP + 50 (BOOK_ADDED) = 130 → level 2, 30 XP remaining
        const user = makeUser(80, 1);
        await grantXpService(user, UserActionType.BOOK_ADDED);

        expect(user.level).toBe(2);
        expect(user.xp).toBe(30);
    });

    it("propagates the error when the transaction fails", async () => {
        transactionMock.mockRejectedValue(new Error("db down"));

        await expect(
            grantXpService(makeUser(0, 1), UserActionType.BOOK_ADDED)
        ).rejects.toThrow("db down");
    });
});
