import { Arg, Query, Resolver, ID } from "type-graphql";
import { UserActions } from "../../../database/entities/user/user-actions";

@Resolver(UserActions)
export class UserActionsResolver {
    @Query(() => [UserActions])
    async userActionsByUser(
        @Arg("id", () => ID) id: number
    ): Promise<UserActions[]> {
        const userActions = UserActions.find({
            where: {
                user: { id: id },
            },
            relations: {
                user: true
            },
        });

        return userActions
    }
}
