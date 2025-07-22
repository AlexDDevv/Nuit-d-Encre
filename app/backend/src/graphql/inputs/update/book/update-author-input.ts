/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * This module defines the `CreateAuthorInput` input type used in GraphQL mutations.
 * It specifies the required and optional fields needed to create a new author entry
 * in the database. This input is used when users submit a new author, including details
 * such as name, birth date, nationality, and optional external references like a
 * Wikipedia link or official website.
 */

import { IsDate, IsOptional, IsUrl, Length, MaxDate, MinDate } from "class-validator";
import { Field, ID, InputType } from "type-graphql";
import { Column } from "typeorm";

/**
 * CreateAuthorInput
 * @description
 * Defines the input fields required to create a new Author.
 *
 * This class is used in GraphQL mutations to receive data for creating an author:
 * - `firstname`: required first name of the author.
 * - `lastname`: required last name of the author.
 * - `birthDate`: required birth date of the author.
 * - `nationality`: required nationality or language of origin.
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

    @Field()
    @Column()
    @Length(1, 100, {
        message: "Firstname must be between 1 and 100 characters.",
    })
    firstname!: string;

    @Field()
    @Column()
    @Length(1, 100, {
        message: "Lastname must be between 1 and 100 characters.",
    })
    lastname!: string;

    @Field()
    @Column()
    @IsDate({ message: "Birth date must be a valid date." })
    @MinDate(new Date("1000-01-01"), {
        message: "Birth date must be after January 1, 1000.",
    })
    @MaxDate(new Date(), {
        message: "Birth date cannot be in the future.",
    })
    birthDate!: Date;

    @Field()
    @Column()
    @Length(1, 100, {
        message: "Nationality must be between 1 and 100 characters ('french', 'english').",
    })
    nationality!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @IsOptional()
    @IsUrl({}, { message: "Wikipedia URL must be a valid URL." })
    wikipediaUrl?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @IsOptional()
    @IsUrl({}, { message: "Official website URL must be a valid URL." })
    officialWebsite?: string;
}
