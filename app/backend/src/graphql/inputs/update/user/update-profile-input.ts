import { IsOptional, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateProfileInput {
    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 100, {
        message: "Le nom d'utilisateur doit contenir entre 2 et 100 caractères.",
    })
    userName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(0, 300, {
        message: "La bio ne peut pas dépasser 300 caractères.",
    })
    bio?: string;
}
