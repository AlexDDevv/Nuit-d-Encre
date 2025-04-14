/**
 * Input type for user creation, used in GraphQL mutations.
 * Includes:
 * - `email`: must be a valid email.
 * - `password`: must be strong (min 10 characters, 1 number, 1 uppercase, 1 symbol).
 */

import { IsEmail, IsStrongPassword } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class createUserInput {
    @IsEmail({}, { message: "Email must be an email" })
    @Field()
    email!: string;

    @Field()
    @IsStrongPassword(
        { minLength: 10, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
        {
            message:
                "Password must be at least 10 characters long and include 1 number, 1 uppercase letter, and 1 symbol",
        }
    )
    password!: string;
}
