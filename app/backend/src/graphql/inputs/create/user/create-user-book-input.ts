/**
 * @packageDocumentation
 * @category GraphQL Inputs
 * @description
 * This module defines the GraphQL input type used to create a UserBook entry.
 * It captures the initial state a user wants to associate with a given book in
 * their personal library: reading status, optional rating/review, recommendation
 * flag, reading dates, and visibility.
 */

import { Field, ID, Int, InputType } from "type-graphql";
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, Max, Min, Validate } from "class-validator";
import { ReadingStatus } from "../../../../types/types";
import { EndAfterStart } from "../../../helpers/endAfterStart";

/**
 * CreateUserBookInput
 * @description
 * Represents the payload required to create a user-book relationship.
 *
 * This input describes:
 * - `bookId`: the target book to attach to the user library (required).
 * - `status`: optional reading status (defaults to TO_READ at persistence level).
 * - `rating`: optional rating (typically 0–5).
 * - `review`: optional free-form textual review.
 * - `recommended`: optional flag indicating if the user recommends the book.
 * - `startedAt`: optional date when the user started reading.
 * - `finishedAt`: optional date when the user finished reading.
 * - `isPublic`: optional visibility flag (defaults to true).
 *
 * Notes:
 * - The `user` is usually taken from the authenticated context on the server;
 *   it is not part of this input.
 * - If `status` is omitted, the database default (TO_READ) will apply.
 * - If `isPublic` is omitted, the database default (true) will apply.
 *
 * @example
 * ```graphql
 * mutation CreateEntry($input: CreateUserBookInput!) {
 *   upsertUserBook(input: $input) {
 *     id
 *     status
 *     rating
 *     review
 *     recommended
 *     startedAt
 *     finishedAt
 *     isPublic
 *     book { id title }
 *   }
 * }
 *
 * # Variables
 * {
 *   "input": {
 *     "bookId": 42,
 *     "status": "READING",
 *     "rating": 5,
 *     "review": "A thoughtful and moving story.",
 *     "recommended": true,
 *     "isPublic": true
 *   }
 * }
 * ```
 *
 * Decorators used:
 * - `@InputType()`: Declares a GraphQL input type.
 * - `@Field()`: Exposes fields to the GraphQL schema (with types and nullability).
 */
@InputType()
export class CreateUserBookInput {
  /**
   * The identifier of the book to attach to the user's library
   * @description
   * Must reference an existing Book.
   */
  @Field(() => ID)
  bookId!: number;

  /**
   * Initial reading status
   * @description
   * If omitted, defaults to TO_READ at the database level.
   */
  @Field(() => ReadingStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  /**
   * Initial rating given by the user
   * @description
   * Optional integer rating (typically 0–5).
   */
@Field(() => Int, { nullable: true })
@IsOptional()
@IsInt()
@Min(0)
@Max(5)
rating?: number;

  /**
   * Initial textual review
   * @description
   * Optional free-form text review attached to the entry.
   */
  @Field({ nullable: true })
  review?: string;

  /**
   * Initial recommendation flag
   * @description
   * Optional boolean indicating whether the user recommends this book.
   */
@Field({ nullable: true })
@IsOptional()
@IsBoolean()
recommended?: boolean;

  /**
   * Visibility of the entry
   * @description
   * If omitted, defaults to true (public).
   */
@Field({ nullable: true })
@IsOptional()
@IsBoolean()
isPublic?: boolean;

  /**
   * Reading start date
   * @description
   * Optional date when the user started reading the book.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startedAt?: Date;

  /**
   * Reading finish date
   * @description
   * Optional date when the user finished reading the book.
   * Must be >= startedAt when both are provided.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Validate(EndAfterStart)
  finishedAt?: Date;
}
