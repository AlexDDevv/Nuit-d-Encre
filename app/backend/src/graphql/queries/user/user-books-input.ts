/**
 * @packageDocumentation
 * @category GraphQL Inputs
 * @description
 * Input used to query the authenticated user's library (UserBook entries),
 * extending the generic book query filters with UserBook-specific filters.
 */

import { Field, InputType, Int } from "type-graphql";
import { IsOptional, IsBoolean, IsEnum, IsInt } from "class-validator";
import { BooksQueryInput } from "../books/books-query-input";
import { ReadingStatus } from "../../../types/types";

/**
 * UserLibraryQueryInput
 * @description
 * Extends base book filters with user-specific flags:
 * - `status`: filter by reading status (UserBook).
 * - `ratingMin` and `ratingMax`: filter by user rating (UserBook).
 * - `recommended`: filter by recommendation flag (UserBook).
 * - `isPublic`: filter by visibility (UserBook).
 */
@InputType()
export class UserBooksQueryInput extends BooksQueryInput {
    @Field(() => ReadingStatus, { nullable: true })
    @IsEnum(ReadingStatus)
    status?: ReadingStatus;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    ratingMin?: number | null;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    ratingMax?: number | null;

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    recommended?: boolean;

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}
