import Cookies from "cookies";
import { User } from "../database/entities/user/user";
import { Loaders } from "../graphql/dataloaders";

export type Context = {
    cookies: Cookies;
    user: User | null | undefined;
    ip: string;
    loaders: Loaders;
};
