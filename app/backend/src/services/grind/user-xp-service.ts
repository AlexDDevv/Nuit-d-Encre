import { XPResultType } from "../../types/types";

export function getXpNeededForLevel(level: number): number {
    return 100 * level;
}

export function addUserXP(currentXP: number, currentLevel: number, gainedXP: number): XPResultType {
    let newXP = currentXP + gainedXP;
    let newLevel = currentLevel;
    let levelUp = false;

    while (newXP >= getXpNeededForLevel(newLevel)) {
        newXP -= getXpNeededForLevel(newLevel);
        newLevel++;
        levelUp = true;
    }

    return {
        newXP,
        newLevel,
        levelUp,
    };
}
