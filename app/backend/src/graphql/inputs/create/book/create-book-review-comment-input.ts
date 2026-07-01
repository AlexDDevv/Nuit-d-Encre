import { Field, ID, InputType } from "type-graphql";
import { IsString, Length } from "class-validator";

/**
 * Données requises pour poster un commentaire sur une critique.
 */
@InputType()
export class CreateBookReviewCommentInput {
    @Field(() => ID)
    reviewId!: string;

    @Field()
    @IsString()
    @Length(1, 500, {
        message: "Le commentaire doit contenir entre 1 et 500 caractères",
    })
    content!: string;
}
