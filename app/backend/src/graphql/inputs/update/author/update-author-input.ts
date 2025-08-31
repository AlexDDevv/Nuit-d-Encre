/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * This module defines the `UpdateAuthorInput` input type used in GraphQL mutations.
 * It specifies the optional fields needed to update an existant author entry
 * in the database. This input is used when users submit an edit of existant author.
 */

import { IsOptional, IsUrl, Length, Matches } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

/**
 * CreateAuthorInput
 * @description
 * Defines the input fields optional to update an existant Author.
 *
 * This class is used in GraphQL mutations to receive data for updating an author:
 * - `firstname`: optional first name of the author.
 * - `lastname`: optional last name of the author.
 * - `birthDate`: optional birth date of the author.
 * - `biography`: optional biography of the author.
 * - `nationality`: optional nationality or language of origin.
 * - `wikipediaUrl`: optional link to a Wikipedia page for the author.
 * - `officialWebsite`: optional link to the author’s official website.
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Validates string length.
 * - `@IsOptional()`: Marks the field as optional during validation.
 * - `@IsUrl()`: check if it's a valid url.
 */
@InputType()
export class UpdateAuthorInput {
    @Field(() => ID)
    id!: number

    @Field({ nullable: true })
    @Length(1, 100, {
        message: "Firstname must be between 1 and 100 characters.",
    })
    firstname?: string;

    @Field({ nullable: true })
    @Length(1, 100, {
        message: "Lastname must be between 1 and 100 characters.",
    })
    lastname?: string;

    @Field({ nullable: true })
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
        message: "Birth date must be in the format DD/MM/YYYY.",
    })
    birthDate?: string;

    @Field({ nullable: true })
    @Length(1, 5000, { message: "Biography must be between 1 and 5000 characters" })
    biography?: string

    @Field({ nullable: true })
    @Length(1, 100, {
        message: "Nationality must be between 1 and 100 characters ('french', 'english').",
    })
    nationality?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsUrl({}, { message: "Wikipedia URL must be a valid URL." })
    wikipediaUrl?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsUrl({}, { message: "Official website URL must be a valid URL." })
    officialWebsite?: string;
}
