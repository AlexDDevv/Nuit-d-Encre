import { addUserXP, getXpNeededForLevel } from "./user-xp-service";

describe("getXpNeededForLevel", () => {
    it("requires 100 XP per level", () => {
        expect(getXpNeededForLevel(1)).toBe(100);
        expect(getXpNeededForLevel(5)).toBe(500);
    });
});

describe("addUserXP", () => {
    it("adds XP without leveling up below the threshold", () => {
        expect(addUserXP(20, 1, 50)).toEqual({
            newXP: 70,
            newLevel: 1,
            levelUp: false,
        });
    });

    it("levels up and carries the XP surplus over", () => {
        // 80 + 50 = 130 → level 2, 30 XP remaining
        expect(addUserXP(80, 1, 50)).toEqual({
            newXP: 30,
            newLevel: 2,
            levelUp: true,
        });
    });

    it("levels up several times in a row when the gain is large enough", () => {
        // 0 + 350 → level 1→2 (-100), level 2→3 (-200), 50 XP remaining
        expect(addUserXP(0, 1, 350)).toEqual({
            newXP: 50,
            newLevel: 3,
            levelUp: true,
        });
    });

    it("levels up when landing exactly on the threshold", () => {
        expect(addUserXP(50, 1, 50)).toEqual({
            newXP: 0,
            newLevel: 2,
            levelUp: true,
        });
    });
});
