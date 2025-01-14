import { decode, verify } from "jsonwebtoken";
import Cookies from "cookies";
import { AuthChecker } from "type-graphql";

export const authChecker: AuthChecker<{ req: any; res: any }> = (
    { root, args, context, info },
    roles
) => {
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get("token");

    if (!token) {
        console.log("Missing token in cookies");
        return false;
    }

    try {
        verify(token, process.env.JWT_SECRET_KEY);
        console.log("Access authorized");
        return true;
    } catch (error) {
        console.log("Access denied");
    }
};
