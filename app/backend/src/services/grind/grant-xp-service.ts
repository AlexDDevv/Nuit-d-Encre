import { dataSource } from "../../database/config/datasource";
import { User } from "../../database/entities/user/user";
import { UserActions } from "../../database/entities/user/user-actions";
import { GrantXPOptions, UserActionType } from "../../types/types";
import { ActionXPMap } from "../../utils/actionsXpMap";
import { addUserXP } from "./user-xp-service";

const UNIQUE_VIOLATION = "23505";

/**
 * Accorde l'XP d'une action, une seule fois par (utilisateur, type, xpKey) :
 * annuler puis refaire une action (retirer/remettre une recommandation, un
 * vote…) ne rapporte rien de plus.
 *
 * @returns `true` si l'XP a été accordée, `false` si la clé était déjà récompensée.
 */
export async function grantXpService(
    user: User,
    actionType: UserActionType,
    options: GrantXPOptions
): Promise<boolean> {
    const xpToAdd = ActionXPMap[actionType];
    const previous = { xp: user.xp, level: user.level };

    try {
        // The XP update and its audit log must stay consistent: persist both
        // in a single transaction so a failure can't leave one without the other.
        return await dataSource.transaction(async (manager) => {
            const alreadyGranted = await manager.exists(UserActions, {
                where: {
                    user: { id: user.id },
                    type: actionType,
                    xpKey: options.xpKey,
                },
            });

            if (alreadyGranted) return false;

            const { newXP, newLevel } = addUserXP(user.xp, user.level, xpToAdd);
            user.xp = newXP;
            user.level = newLevel;

            const action = new UserActions();
            action.user = user;
            action.type = actionType;
            action.xp = xpToAdd;
            action.xpKey = options.xpKey;

            if (options.targetId) {
                action.targetId = options.targetId;
            }

            if (options.metadata) {
                action.metadata = JSON.stringify(options.metadata);
            }

            await manager.save(user);
            await manager.save(action);

            return true;
        });
    } catch (error) {
        user.xp = previous.xp;
        user.level = previous.level;

        // Deux requêtes concurrentes pour la même clé : l'index unique
        // départage, la perdante n'accorde rien.
        if ((error as { code?: string })?.code === UNIQUE_VIOLATION) {
            return false;
        }

        throw error;
    }
}
