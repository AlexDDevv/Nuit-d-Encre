export type XPResultType = {
    newXP: number;
    newLevel: number;
    levelUp: boolean;
};

export type GrantXPOptions = {
    targetId?: string;
    metadata?: Record<string, any>;
};
