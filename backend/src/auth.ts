import { verify } from "jsonwebtoken";
import Cookies from "cookies";
import { AuthChecker } from "type-graphql";
import { User } from "./entities/User";

export type ContextType = {
    req: any;
    res: any;
    user: User | null | undefined;
};

export type AuthContextType = ContextType & { user: User };

export const getUserFromContext = async (
    context: ContextType
): Promise<User | null> => {
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get("token");

    if (!token) {
        console.log("Missing token in cookies");
        return null;
    }

    try {
        const payload = verify(
            token,
            process.env.JWT_SECRET_KEY
        ) as unknown as { id: number };

        console.log("Access authorized");

        const user = await User.findOneBy({
            id: payload.id,
        });

        return user;
    } catch (err) {
        console.error(err);
        throw new Error("Invalid JWT");
    }
};

export const authChecker: AuthChecker<ContextType> = async (
    { root, args, context, info },
    roles
) => {
    if (roles.length === 0) {
        roles = ["admin"];
    }

    const user = await getUserFromContext(context);
    context.user = user;

    if (user && roles.includes(user.role)) {
        return true;
    } else {
        return false;
    }
};
