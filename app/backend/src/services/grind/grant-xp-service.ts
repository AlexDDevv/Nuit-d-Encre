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
    await User.save(user);

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

    await UserActions.save(action);
}
