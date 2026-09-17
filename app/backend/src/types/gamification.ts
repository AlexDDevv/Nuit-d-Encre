export type XPResultType = {
    newXP: number;
    newLevel: number;
    levelUp: boolean;
};

export type GrantXPOptions = {
    // Identifie ce qui est récompensé : une même clé ne rapporte de l'XP
    // qu'une seule fois par utilisateur et par type d'action.
    xpKey: string;
    targetId?: string;
    metadata?: Record<string, any>;
};
