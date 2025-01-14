import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createUserInput, User } from "../entities/User";
import { validate } from "class-validator";
import { hash, verify } from "argon2";
import { sign, verify as jwtVerify, decode } from "jsonwebtoken";
import Cookies from "cookies";

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async createUser(
        @Arg("data", () => createUserInput) data: createUserInput
    ): Promise<User> {
        const errors = await validate(data);

        if (errors.length > 0) {
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }

        const newUser = new User();

        try {
            const hashedPassword = await hash(data.password);

            Object.assign(newUser, data, {
                hashedPassword,
                password: undefined,
            });

            await newUser.save();
            return newUser;
        } catch (err) {
            console.error(err);
            throw new Error("Unable to create user");
        }
    }

    @Mutation(() => User, { nullable: true })
    async signIn(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: { req: any; res: any }
    ): Promise<User> {
        try {
            const user = await User.findOneBy({
                email,
            });
            if (user) {
                if (await verify(user.hashedPassword, password)) {
                    const token = sign(
                        {
                            id: user.id,
                        },
                        process.env.JWT_SECRET_KEY
                    );
                    console.log("🚀 ~ UserResolver ~ token:", token);

                    // jwtVerify(token, process.env.JWT_SECRET_KEY)

                    const cookies = new Cookies(context.req, context.res);

                    cookies.set("token", token, {
                        secure: false,
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 48,
                    });

                    return user;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
            throw new Error("Unable to sign in");
        }
    }

    @Authorized()
    @Query(() => User, { nullable: true })
    async whoami(@Ctx() context: { req: any; res: any }) {
        const cookies = new Cookies(context.req, context.res);
        const token = cookies.get("token");
        const payload = decode(token) as unknown as { id: number };
        const user = await User.findOneBy({
            id: payload.id,
        });
        return user;
    }
}
