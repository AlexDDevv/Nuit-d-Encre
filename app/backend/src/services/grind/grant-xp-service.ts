import { dataSource } from "../../database/config/datasource";
import { User } from "../../database/entities/user/user";
import { UserActions } from "../../database/entities/user/user-actions";
import { GrantXPOptions, UserActionType } from "../../types/types";
import { ActionXPMap } from "../../utils/actionsXpMap";
import { addUserXP } from "./user-xp-service";

export async function grantXpService(
    user: User,
    actionType: UserActionType,
    options?: GrantXPOptions
): Promise<void> {
    const xpToAdd = ActionXPMap[actionType];

    const { newXP, newLevel } = addUserXP(user.xp, user.level, xpToAdd);

    user.xp = newXP;
    user.level = newLevel;

    const action = new UserActions();
    action.user = user;
    action.type = actionType;
    action.xp = xpToAdd;

    if (options?.targetId) {
        action.targetId = options.targetId;
    }

    if (options?.metadata) {
        action.metadata = JSON.stringify(options.metadata);
    }

    // The XP update and its audit log must stay consistent: persist both
    // in a single transaction so a failure can't leave one without the other.
    await dataSource.transaction(async (manager) => {
        await manager.save(user);
        await manager.save(action);
    });
}
